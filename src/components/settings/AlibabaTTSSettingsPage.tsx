import { useTranslation } from 'react-i18next';

import { BasicPage, FormRow, NotUsingAlert } from './common';
import { TextInput } from '@/components/textInput';
import { SecretTextInput } from '@/components/secretTextInput';
import { SwitchBox } from '@/components/switchBox';
import { config, updateConfig } from '@/utils/config';

const alibabaTTSVoices = [
  { key: 'Chelsie', label: 'Chelsie' },
  { key: 'Serena', label: 'Serena' },
  { key: 'Cherry', label: 'Cherry' },
  { key: 'Ethan', label: 'Ethan' },
  { key: 'Momo', label: 'Momo' },
];

const customVoiceKey = '__custom__';
const customModelKey = '__custom_model__';

const alibabaTTSModels = [
  { key: 'qwen3-tts-flash', label: 'qwen3-tts-flash' },
  { key: 'qwen3-tts-flash-2025-11-27', label: 'qwen3-tts-flash-2025-11-27' },
  { key: 'qwen3-tts-flash-2025-09-18', label: 'qwen3-tts-flash-2025-09-18' },
  { key: 'qwen3-tts-instruct-flash', label: 'qwen3-tts-instruct-flash' },
  { key: 'qwen3-tts-instruct-flash-2026-01-26', label: 'qwen3-tts-instruct-flash-2026-01-26' },
];

export function AlibabaTTSSettingsPage({
  alibabaTTSApiKey,
  setAlibabaTTSApiKey,
  alibabaTTSUrl,
  setAlibabaTTSUrl,
  alibabaTTSModel,
  setAlibabaTTSModel,
  alibabaTTSVoice,
  setAlibabaTTSVoice,
  alibabaTTSUseServerKey,
  setAlibabaTTSUseServerKey,
  setSettingsUpdated,
}: {
  alibabaTTSApiKey: string;
  setAlibabaTTSApiKey: (key: string) => void;
  alibabaTTSUrl: string;
  setAlibabaTTSUrl: (url: string) => void;
  alibabaTTSModel: string;
  setAlibabaTTSModel: (model: string) => void;
  alibabaTTSVoice: string;
  setAlibabaTTSVoice: (voice: string) => void;
  alibabaTTSUseServerKey: boolean;
  setAlibabaTTSUseServerKey: (enabled: boolean) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();
  const selectedModelPreset = alibabaTTSModels.some((model) => model.key === alibabaTTSModel)
    ? alibabaTTSModel
    : customModelKey;
  const selectedPreset = alibabaTTSVoices.some((voice) => voice.key === alibabaTTSVoice)
    ? alibabaTTSVoice
    : customVoiceKey;

  return (
    <BasicPage
      title={t('Alibaba Cloud') + ' ' + t('Settings')}
      description={t(
        'Alibaba_Cloud_TTS_desc',
        'Configure Alibaba Cloud TTS. qwen3-tts-flash is the default model. Use a preset voice or paste a custom voice ID from Alibaba Cloud Model Studio.',
      )}
    >
      {config('tts_backend') !== 'alibaba_tts' && (
        <NotUsingAlert>
          {t('not_using_alert', 'You are not currently using {{name}} as your {{what}} backend. These settings will not be used.', { name: t('Alibaba Cloud'), what: t('TTS') })}
        </NotUsingAlert>
      )}
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <SwitchBox
            value={alibabaTTSUseServerKey}
            label={t('Use server key', 'Use server key')}
            onChange={(value: boolean) => {
              setAlibabaTTSUseServerKey(value);
              updateConfig('alibaba_tts_use_server_key', value ? 'true' : 'false');
              setSettingsUpdated(true);
            }}
          />
        </li>
        {!alibabaTTSUseServerKey && (
          <li className="py-4">
            <FormRow label={t('API Key')}>
              <SecretTextInput
                value={alibabaTTSApiKey}
                onChange={(event: React.ChangeEvent<any>) => {
                  setAlibabaTTSApiKey(event.target.value);
                  updateConfig('alibaba_tts_apikey', event.target.value);
                  setSettingsUpdated(true);
                }}
              />
            </FormRow>
          </li>
        )}
        <li className="py-4">
          <FormRow label={t('API URL')}>
            <TextInput
              value={alibabaTTSUrl}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaTTSUrl(event.target.value);
                updateConfig('alibaba_tts_url', event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t('Model Preset', 'Model Preset')}>
            <select
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={selectedModelPreset}
              onChange={(event: React.ChangeEvent<any>) => {
                if (event.target.value === customModelKey) {
                  return;
                }

                setAlibabaTTSModel(event.target.value);
                updateConfig('alibaba_tts_model', event.target.value);
                setSettingsUpdated(true);
              }}
            >
              {alibabaTTSModels.map((model) => (
                <option key={model.key} value={model.key}>{model.label}</option>
              ))}
              <option value={customModelKey}>{t('Custom', 'Custom')}</option>
            </select>
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t('Model ID', 'Model ID')}>
            <TextInput
              value={alibabaTTSModel}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaTTSModel(event.target.value);
                updateConfig('alibaba_tts_model', event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t('Voice Preset', 'Voice Preset')}>
            <select
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={selectedPreset}
              onChange={(event: React.ChangeEvent<any>) => {
                if (event.target.value === customVoiceKey) {
                  return;
                }

                setAlibabaTTSVoice(event.target.value);
                updateConfig('alibaba_tts_voice', event.target.value);
                setSettingsUpdated(true);
              }}
            >
              {alibabaTTSVoices.map((voice) => (
                <option key={voice.key} value={voice.key}>{voice.label}</option>
              ))}
              <option value={customVoiceKey}>{t('Custom', 'Custom')}</option>
            </select>
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t('Voice ID', 'Voice ID')}>
            <TextInput
              value={alibabaTTSVoice}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaTTSVoice(event.target.value);
                updateConfig('alibaba_tts_voice', event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
      </ul>
    </BasicPage>
  );
}
