import { useTranslation } from 'react-i18next';

import { BasicPage, FormRow, NotUsingAlert } from './common';
import { TextInput } from '@/components/textInput';
import { SecretTextInput } from '@/components/secretTextInput';
import { SwitchBox } from '@/components/switchBox';
import { config, updateConfig } from '@/utils/config';

export function AlibabaSettingsPage({
  alibabaApiKey,
  setAlibabaApiKey,
  alibabaUrl,
  setAlibabaUrl,
  alibabaModel,
  setAlibabaModel,
  alibabaEnableThinking,
  setAlibabaEnableThinking,
  alibabaUseServerKey,
  setAlibabaUseServerKey,
  setSettingsUpdated,
}: {
  alibabaApiKey: string;
  setAlibabaApiKey: (key: string) => void;
  alibabaUrl: string;
  setAlibabaUrl: (url: string) => void;
  alibabaModel: string;
  setAlibabaModel: (model: string) => void;
  alibabaEnableThinking: boolean;
  setAlibabaEnableThinking: (enabled: boolean) => void;
  alibabaUseServerKey: boolean;
  setAlibabaUseServerKey: (enabled: boolean) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();

  const description = (
    <>
      {t("Alibaba_Cloud_desc", "Configure Alibaba Cloud Model Studio chat settings. Use the Singapore compatible-mode base URL if you want to connect through DashScope International.")}
    </>
  );

  return (
    <BasicPage
      title={t("Alibaba Cloud") + " " + t("Settings")}
      description={description}
    >
      {config("chatbot_backend") !== "alibaba" && (
        <NotUsingAlert>
          {t("not_using_alert", "You are not currently using {{name}} as your {{what}} backend. These settings will not be used.", { name: t("Alibaba Cloud"), what: t("ChatBot") })}
        </NotUsingAlert>
      )}
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <SwitchBox
            value={alibabaUseServerKey}
            label={t("Use server key", "Use server key")}
            onChange={(value: boolean) => {
              setAlibabaUseServerKey(value);
              updateConfig("alibaba_use_server_key", value ? "true" : "false");
              setSettingsUpdated(true);
            }}
          />
        </li>
        {!alibabaUseServerKey && (
          <li className="py-4">
            <FormRow label={t("API Key")}>
              <SecretTextInput
                value={alibabaApiKey}
                onChange={(event: React.ChangeEvent<any>) => {
                  setAlibabaApiKey(event.target.value);
                  updateConfig("alibaba_apikey", event.target.value);
                  setSettingsUpdated(true);
                }}
              />
            </FormRow>
          </li>
        )}
        <li className="py-4">
          <FormRow label={t("API URL")}>
            <TextInput
              value={alibabaUrl}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaUrl(event.target.value);
                updateConfig("alibaba_url", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t("Model")}>
            <TextInput
              value={alibabaModel}
              onChange={(event: React.ChangeEvent<any>) => {
                setAlibabaModel(event.target.value);
                updateConfig("alibaba_model", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <SwitchBox
            value={alibabaEnableThinking}
            label={t("Thinking Mode")}
            onChange={(value: boolean) => {
              setAlibabaEnableThinking(value);
              updateConfig("alibaba_enable_thinking", value ? "true" : "false");
              setSettingsUpdated(true);
            }}
          />
        </li>
      </ul>
    </BasicPage>
  );
}
