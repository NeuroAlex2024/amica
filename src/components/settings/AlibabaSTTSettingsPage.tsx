import { useTranslation } from 'react-i18next';

import { BasicPage, FormRow, NotUsingAlert } from './common';
import { TextInput } from '@/components/textInput';
import { SecretTextInput } from '@/components/secretTextInput';
import { SwitchBox } from '@/components/switchBox';
import { config, updateConfig } from '@/utils/config';

const customModelKey = '__custom_model__';

const alibabaSTTModels = [
  { key: 'qwen3-asr-flash-2026-02-10', label: 'qwen3-asr-flash-2026-02-10' },
  { key: 'qwen3-asr-flash-2025-09-08', label: 'qwen3-asr-flash-2025-09-08' },
];

export function AlibabaSTTSettingsPage({
  alibabaSTTApiKey,
  setAlibabaSTTApiKey,
  alibabaSTTUrl,
  setAlibabaSTTUrl,
  alibabaSTTModel,
  setAlibabaSTTModel,
  alibabaSTTUseServerKey,
  setAlibabaSTTUseServerKey,
  setSettingsUpdated,
}: {
  alibabaSTTApiKey: string;
  setAlibabaSTTApiKey: (key: string) => void;
  alibabaSTTUrl: string;
  setAlibabaSTTUrl: (url: string) => void;
  alibabaSTTModel: string;
  setAlibabaSTTModel: (model: string) => void;
  alibabaSTTUseServerKey: boolean;
  setAlibabaSTTUseServerKey: (enabled: boolean) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();
  const selectedModelPreset = alibabaSTTModels.some((model) => model.key === alibabaSTTModel)
    ? alibabaSTTModel
    : customModelKey;

  return (
    <BasicPage
      title={t('Alibaba Cloud') + ' ' + t('Settings')}
      description={t(
        'Alibaba_Cloud_STT_desc',
        'Configure Alibaba Cloud speech-to-text. Choose a preset Qwen ASR model or enter a custom Model Studio speech recognition model ID.',
      )}
    >
      {config('stt_backend') !== 'alibaba_stt' && (
        <NotUsingAlert>
          {t('not_using_alert', 'You are not currently using {{name}} as your {{what}} backend. These settings will not be used.', { name: t('Alibaba Cloud'), what: t('STT') })}
        </NotUsingAlert>
      )}
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <SwitchBox
            value={alibabaSTTUseServerKey}
            label={t('Use server key', 'Use server key')}
            onChange={(value: boolean) => {
              setAlibabaSTTUseServerKey(value);
              updateConfig('alibaba_stt_use_server_key', value ? 'true' : 'false');
              setSettingsUpdated(true);
            }}
          />
        </li>
        {!alibabaSTTUseServerKey && (
          <li className="py-4">
            <FormRow label={t('API Key')}>
              <SecretTextInput
                value={alibabaSTTApiKey}
                onChange={(event: React.ChangeEvent<any>) => {
                  setAlibabaSTTApiKey(event.target.value);
                  updateConfig('alibaba_stt_apikey', event.target.value);
                  setSettingsUpdated(true);
                }}
              />
            </FormRow>
          </li>
        )}
        <li className="py-4">
          <FormRow label={t('API URL')}>
            <TextInput
              value={alibabaSTTUrl}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaSTTUrl(event.target.value);
                updateConfig('alibaba_stt_url', event.target.value);
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

                setAlibabaSTTModel(event.target.value);
                updateConfig('alibaba_stt_model', event.target.value);
                setSettingsUpdated(true);
              }}
            >
              {alibabaSTTModels.map((model) => (
                <option key={model.key} value={model.key}>{model.label}</option>
              ))}
              <option value={customModelKey}>{t('Custom', 'Custom')}</option>
            </select>
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t('Model ID', 'Model ID')}>
            <TextInput
              value={alibabaSTTModel}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaSTTModel(event.target.value);
                updateConfig('alibaba_stt_model', event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
      </ul>
    </BasicPage>
  );
}
