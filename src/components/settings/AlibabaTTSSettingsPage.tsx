import { useTranslation } from 'react-i18next';

import { BasicPage, FormRow, NotUsingAlert } from './common';
import { TextInput } from '@/components/textInput';
import { SecretTextInput } from '@/components/secretTextInput';
import { config, updateConfig } from '@/utils/config';

const alibabaTTSVoices = [
  { key: 'Serena', label: 'Serena' },
  { key: 'Cherry', label: 'Cherry' },
  { key: 'Chelsie', label: 'Chelsie' },
  { key: 'Ethan', label: 'Ethan' },
];

const customVoiceKey = '__custom__';

export function AlibabaTTSSettingsPage({
  alibabaTTSApiKey,
  setAlibabaTTSApiKey,
  alibabaTTSUrl,
  setAlibabaTTSUrl,
  alibabaTTSModel,
  setAlibabaTTSModel,
  alibabaTTSVoice,
  setAlibabaTTSVoice,
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
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();
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
          <FormRow label={t('Model')}>
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
