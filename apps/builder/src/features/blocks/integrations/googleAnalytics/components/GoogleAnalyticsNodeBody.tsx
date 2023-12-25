import React from 'react'
import { Text } from '@chakra-ui/react'
import { GoogleAnalyticsBlock } from '@typebot.io/schemas'
import { useTranslate } from '@tolgee/react'

type Props = {
  action: NonNullable<GoogleAnalyticsBlock['options']>['action']
}

export const GoogleAnalyticsNodeBody = ({ action }: Props) => {
  const { t } = useTranslate()

  return (
    <Text color={action ? 'currentcolor' : 'gray.500'} noOfLines={1}>
      {action
        ? `${t(
            "editor.blocks.integration.analytics.track.label",
            "Track"
          )} "${action}"`
        : "Configure..."}
    </Text>
  )
}
