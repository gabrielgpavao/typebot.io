import React from 'react'
import { Stack } from '@chakra-ui/react'
import { Webhook, WebhookBlock } from '@typebot.io/schemas'
import { TextInput } from '@/components/inputs'
import { WebhookAdvancedConfigForm } from './WebhookAdvancedConfigForm'
import { useTranslate } from '@tolgee/react'

type Props = {
  block: WebhookBlock
  onOptionsChange: (options: WebhookBlock['options']) => void
}

export const WebhookSettings = ({
  block: { id: blockId, options },
  onOptionsChange,
}: Props) => {
	const { t } = useTranslate()
	
  const setLocalWebhook = async (newLocalWebhook: Webhook) => {
    onOptionsChange({ ...options, webhook: newLocalWebhook })
  }

  const updateUrl = (url: string) => {
    onOptionsChange({ ...options, webhook: { ...options?.webhook, url } })
  }

  return (
    <Stack spacing={4}>
      <TextInput
        placeholder={t("editor.blocks.integration.webhook.settings.url.placeholder")}
        defaultValue={options?.webhook?.url}
        onChange={updateUrl}
      />
      <WebhookAdvancedConfigForm
        blockId={blockId}
        webhook={options?.webhook}
        options={options}
        onWebhookChange={setLocalWebhook}
        onOptionsChange={onOptionsChange}
      />
    </Stack>
  )
}
