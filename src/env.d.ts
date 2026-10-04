/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_URL: string;
  readonly VITE_HOSTED_API_URL: string;
  readonly VITE_IS_HOSTED: string;
  readonly VITE_ROUTER: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_MICROSOFT_CLIENT_ID: string;
  readonly VITE_DEMO_ENDPOINT: string;
  readonly VITE_DEMO_EMAIL: string;
  readonly VITE_DEMO_PASSWORD: string;
  readonly VITE_DEV_CALENDAR: string;
  readonly VITE_IS_PRODUCTION: string;
  readonly VITE_WHITELABEL_INVOICE_URL: string;
  readonly VITE_PUSHER_APP_KEY: string;
  readonly VITE_HOSTED_STRIPE_PK: string;
  readonly VITE_ENABLE_PEPPOL_STANDARD: string;
  readonly VITE_ENABLE_NEW_ACCOUNT_MANAGEMENT: string;
  readonly VITE_SHOW_ACCOUNT_PLAN_EXPIRED_BANNER: string;
  readonly VITE_ENABLE_APPLE_LOGIN: string;
  readonly VITE_ENABLE_DOCUNINJA: string;
  readonly VITE_SENTRY_URL: string;
  readonly VITE_SENTRY_RELEASE: string;
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE: string;
  readonly VITE_SENTRY_TRACE_PROPAGATION_TARGETS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'localized-address-format' {
  export const formatAddress: any;
}

declare module 'react-multi-email' {
  export const ReactMultiEmail: any;
  export const isEmail: any;
}

declare module '@tanstack/react-query-devtools' {
  export const ReactQueryDevtools: any;
}

declare module '@docuninja/builder2.0' {
  export type Document = any;
  export type AlertProps = any;
  export type ConfirmationDialogButtonProps = any;
  export type ConfirmationDialogProps = any;
  export type CreateDialogTabButtonProps = any;
  export type DeleteDialogButtonProps = any;
  export type DeleteDialogProps = any;
  export type ImportFromButtonProps = any;
  export type RectangleSettingsCheckboxProps = any;
  export type RectangleSettingsDialogProps = any;
  export type RectangleSettingsInputProps = any;
  export type RectangleSettingsLabelProps = any;
  export type RectangleSettingsSelectProps = any;
  export type ToolboxContextProps = any;
  export type UninviteDialogButtonProps = any;
  export type UninviteDialogProps = any;
  export type UploadDialogProps = any;
  export type UploadProps = any;
  export type ValidationErrorsProps = any;
  export type SignatorySelectorProps = any;
  export type SendDialogProps = any;
  export type SendDialogButtonProps = any;
  export type CreateDialogProps = any;
  export type CreateClientTabProps = any;
  export type CreateBlueprintSignatoryProps = any;
  export type SignatorySwapProps = any;
  export type StartSigningButtonProps = any;
  export type MinimizeButtonProps = any;
  export type SubmitButtonProps = any;
  export type DateInputProps = any;
  export type SignatureSelectorDialogProps = any;
  export type SignatureSelectorInputProps = any;
  export type SignatureSelectorButtonProps = any;
  export type SignCardProps = any;
  export type NavigateButtonProps = any;
  export type RectangleSettingsRemoveButtonProps = any;
  export type RectangleSettingsOptionItemProps = any;
  export type RectangleSettingsOptionsListProps = any;
  export type RectangleSettingsDialogButtonProps = any;
  export type SignatureClearButtonProps = any;

  export const useBuilderStore: any;
  export const useWebSocketSubscription: any;
  export const Builder: any;
  export const SignatorySelectorProps: any;
  export const DocumentCreationDropZone: any;
  export const ElementPropertiesPanel: any;
  export const ElementToolbox: any;
  export const PageThumbnails: any;
  export const RecipientPanel: any;
  export const SignatureDialog: any;
  export const getPasswordForPdf: any;
  export const isPdfPasswordProtected: any;
  export const BuilderContext: any;
  export const CreateBlueprintSignatoryProps: any;
  export const CreateClientTabProps: any;
  export const CreateDialogProps: any;
  export const SendDialogButtonProps: any;
  export const SendDialogProps: any;
  export const SignatorySwapProps: any;
  export const DateInputProps: any;
  export const MinimizeButtonProps: any;
  export const NavigateButtonProps: any;
  export const Sign: any;
  export const SignatureSelectorButtonProps: any;
  export const SignatureSelectorDialogProps: any;
  export const SignatureSelectorInputProps: any;
  export const SignCardProps: any;
  export const SignContext: any;
  export const StartSigningButtonProps: any;
  export const SubmitButtonProps: any;
  export const Document: any;
  export const AlertProps: any;
  export const ConfirmationDialogButtonProps: any;
  export const ConfirmationDialogProps: any;
  export const CreateDialogTabButtonProps: any;
  export const DeleteDialogButtonProps: any;
  export const DeleteDialogProps: any;
  export const ImportFromButtonProps: any;
  export const RectangleSettingsCheckboxProps: any;
  export const RectangleSettingsDialogProps: any;
  export const RectangleSettingsInputProps: any;
  export const RectangleSettingsLabelProps: any;
  export const RectangleSettingsSelectProps: any;
  export const ToolboxContextProps: any;
  export const UninviteDialogButtonProps: any;
  export const UninviteDialogProps: any;
  export const UploadDialogProps: any;
  export const UploadProps: any;
  export const ValidationErrorsProps: any;
}
