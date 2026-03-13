/**
 * Lightweight latency tracker for Amica pipeline.
 *
 * Usage:
 *   latency.start('voice')       – begin a new session
 *   latency.mark('vad_start')    – record a named timestamp (idempotent per session)
 *   latency.done()               – finalise, compute deltas, push to history
 *
 * Last 5 snapshots are also written to window.__amica_latency for console inspection.
 */

const MAX_SESSIONS = 5;

export interface LatencyDelta {
  label: string;
  ms: number;
}

export interface LatencySnapshot {
  id: number;
  type: string;
  time: string;
  deltas: LatencyDelta[];
  /** raw stage→ms-from-session-start map */
  marks: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Module-level state (singleton, lives for the page lifetime)
// ---------------------------------------------------------------------------

let _id = 0;
let _sessionStart = 0;
let _sessionType = 'text';
let _marks: Record<string, number> = {};   // stage → performance.now() at mark time
let _snapshots: LatencySnapshot[] = [];

// Pairs that produce delta rows: [label, fromStage, toStage]
const DELTA_PAIRS: [string, string, string][] = [
  ['VAD',           'vad_start',          'vad_end'],
  ['STT',           'stt_start',          'stt_end'],
  ['→ 1st token',   'llm_start',          'llm_first_token'],
  ['→ 1st sentence','llm_start',          'llm_first_sentence'],
  ['TTS fetch',     'tts_start',          'tts_ready'],
  ['TTS → avatar',  'tts_start',          'avatar_start'],
  ['E2E voice',     'vad_end',            'avatar_start'],
  ['E2E text',      'llm_start',          'avatar_start'],
  ['Vision',        'vision_start',       'vision_end'],
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const latency = {
  /** Start a new latency session, discarding any previous in-progress state. */
  start(type: 'text' | 'voice' | 'vision' = 'text') {
    _id++;
    _sessionStart = performance.now();
    _sessionType = type;
    _marks = {};
  },

  /**
   * Record a stage timestamp.
   * Idempotent: calling the same stage twice keeps the first value,
   * so it's safe to call from loops (e.g. TTS / speak queues).
   */
  mark(stage: string) {
    if (stage in _marks) return;   // already recorded → keep first
    _marks[stage] = performance.now();
  },

  /**
   * Finalise the current session: compute deltas, push to history,
   * expose on window.__amica_latency, log to console.
   * Safe to call multiple times (subsequent calls are no-ops until next start()).
   */
  done() {
    if (_id === 0 || Object.keys(_marks).length === 0) return;

    const relMs = (stage: string): number | undefined => {
      const t = _marks[stage];
      return t !== undefined ? Math.round(t - _sessionStart) : undefined;
    };

    const delta = (from: string, to: string): number | undefined => {
      const a = _marks[from];
      const b = _marks[to];
      return (a !== undefined && b !== undefined) ? Math.round(b - a) : undefined;
    };

    const deltas: LatencyDelta[] = DELTA_PAIRS
      .map(([label, from, to]) => ({ label, ms: delta(from, to)! }))
      .filter(x => x.ms !== undefined && x.ms >= 0);

    // Build a human-readable marks map (ms from session start)
    const marksRel: Record<string, number> = {};
    for (const [stage] of Object.entries(_marks)) {
      const v = relMs(stage);
      if (v !== undefined) marksRel[stage] = v;
    }

    const snap: LatencySnapshot = {
      id: _id,
      type: _sessionType,
      time: new Date().toLocaleTimeString(),
      deltas,
      marks: marksRel,
    };

    _snapshots = [snap, ..._snapshots].slice(0, MAX_SESSIONS);

    if (typeof window !== 'undefined') {
      (window as any).__amica_latency = _snapshots;
    }

    console.log(
      `[latency] #${snap.id} ${snap.type} @ ${snap.time} | ` +
      deltas.map(d => `${d.label}: ${d.ms}ms`).join(' · ')
    );

    // Reset id to prevent duplicate done() calls having effect
    _id = 0;
    _marks = {};
  },

  get snapshots(): LatencySnapshot[] {
    return _snapshots;
  },
};
