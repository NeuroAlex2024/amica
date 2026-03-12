import { useTranslation } from 'react-i18next';

import { BasicPage, FormRow, NotUsingAlert } from "./common";
import { TextInput } from "@/components/textInput";
import { SecretTextInput } from "@/components/secretTextInput";
import { SwitchBox } from '@/components/switchBox';
import { config, updateConfig } from "@/utils/config";

export function VisionAlibabaSettingsPage({
  visionAlibabaApiKey,
  setVisionAlibabaApiKey,
  visionAlibabaUrl,
  setVisionAlibabaUrl,
  visionAlibabaModel,
  setVisionAlibabaModel,
  visionAlibabaUseServerKey,
  setVisionAlibabaUseServerKey,
  setSettingsUpdated,
}: {
  visionAlibabaApiKey: string;
  setVisionAlibabaApiKey: (url: string) => void;
  visionAlibabaUrl: string;
  setVisionAlibabaUrl: (url: string) => void;
  visionAlibabaModel: string;
  setVisionAlibabaModel: (url: string) => void;
  visionAlibabaUseServerKey: boolean;
  setVisionAlibabaUseServerKey: (enabled: boolean) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();

  const description = <>{t("Alibaba_Cloud_Vision_desc", "Configure Alibaba Cloud vision settings. Use the Singapore compatible-mode base URL and a multimodal model such as qwen3.5-plus.")}</>;

  return (
    <BasicPage
      title={t("Alibaba Cloud") + " " + t("Settings")}
      description={description}
    >
      { config("vision_backend") !== "vision_alibaba" && (
        <NotUsingAlert>
          {t("not_using_alert", "You are not currently using {{name}} as your {{what}} backend. These settings will not be used.", {name: t("Alibaba Cloud"), what: t("Vision")})}
        </NotUsingAlert>
      ) }
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <SwitchBox
            value={visionAlibabaUseServerKey}
            label={t("Use server key", "Use server key")}
            onChange={(value: boolean) => {
              setVisionAlibabaUseServerKey(value);
              updateConfig("vision_alibaba_use_server_key", value ? "true" : "false");
              setSettingsUpdated(true);
            }}
          />
        </li>
        {!visionAlibabaUseServerKey && (
          <li className="py-4">
            <FormRow label={t("API Key")}>
              <SecretTextInput
                value={visionAlibabaApiKey}
                onChange={(event: React.ChangeEvent<any>) => {
                  event.preventDefault();
                  setVisionAlibabaApiKey(event.target.value);
                  updateConfig("vision_alibaba_apikey", event.target.value);
                  setSettingsUpdated(true);
                }}
              />
            </FormRow>
          </li>
        )}
        <li className="py-4">
          <FormRow label={t("API URL")}>
            <TextInput
              value={visionAlibabaUrl}
              onChange={(event: React.ChangeEvent<any>) => {
                setVisionAlibabaUrl(event.target.value);
                updateConfig("vision_alibaba_url", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t("Model")}>
            <TextInput
              value={visionAlibabaModel}
              onChange={(event: React.ChangeEvent<any>) => {
                setVisionAlibabaModel(event.target.value);
                updateConfig("vision_alibaba_model", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
      </ul>
    </BasicPage>
  );
}
