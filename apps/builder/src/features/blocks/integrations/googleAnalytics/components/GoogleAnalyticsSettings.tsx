import { NumberInput, TextInput } from '@/components/inputs'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
} from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'
import { GoogleAnalyticsBlock } from '@typebot.io/schemas'
import React from 'react'

type Props = {
  options?: GoogleAnalyticsBlock['options']
  onOptionsChange: (options: GoogleAnalyticsBlock['options']) => void
}

export const GoogleAnalyticsSettings = ({
  options,
  onOptionsChange,
}: Props) => {
	const { t } =useTranslate()
	
  const updateTrackingId = (trackingId: string) =>
    onOptionsChange({ ...options, trackingId })

  const updateCategory = (category: string) =>
    onOptionsChange({ ...options, category })

  const updateAction = (action: string) =>
    onOptionsChange({ ...options, action })

  const updateLabel = (label: string) => onOptionsChange({ ...options, label })

  const updateValue = (value: number | `{{${string}}}` | undefined) =>
    onOptionsChange({
      ...options,
      value,
    })

  const updateSendTo = (sendTo?: string) =>
    onOptionsChange({
      ...options,
      sendTo,
    })

  return (
    <Stack spacing={4}>
      <TextInput
        label={t("editor.blocks.integration.analytics.settings.measurementId.label")}
        moreInfoTooltip={t("editor.blocks.integration.analytics.settings.measurementId.infoText")}
        defaultValue={options?.trackingId}
        placeholder="G-123456..."
        onChange={updateTrackingId}
      />
      <TextInput
        label={t("editor.blocks.integration.analytics.settings.eventAction.label")}
        defaultValue={options?.action}
        placeholder={t("editor.blocks.integration.analytics.settings.eventAction.example")}
        onChange={updateAction}
      />
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {t("editor.blocks.integration.analytics.settings.advanced")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} as={Stack} spacing="6">
            <TextInput
              label={t("editor.blocks.integration.analytics.settings.advanced.eventCategory.label")}
              defaultValue={options?.category}
              placeholder={t("editor.blocks.integration.analytics.settings.advanced.eventCategory.example")}
              onChange={updateCategory}
            />
            <TextInput
              label={t("editor.blocks.integration.analytics.settings.advanced.eventLabel.label")}
              defaultValue={options?.label}
              placeholder={t("editor.blocks.integration.analytics.settings.advanced.eventLabel.example")}
              onChange={updateLabel}
            />
            <NumberInput
              direction="column"
              label={t("editor.blocks.integration.analytics.settings.advanced.eventValue.label")}
              defaultValue={options?.value}
              placeholder={t("editor.blocks.integration.analytics.settings.advanced.eventValue.example")}
              onValueChange={updateValue}
            />
            <TextInput
              label={t("editor.blocks.integration.analytics.settings.advanced.sendTo.label")}
              moreInfoTooltip={t("editor.blocks.integration.analytics.settings.advanced.sendTo.infoText")}
              defaultValue={options?.sendTo?.toString()}
              placeholder={t("editor.blocks.integration.analytics.settings.advanced.sendTo.example")}
              onChange={updateSendTo}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}
