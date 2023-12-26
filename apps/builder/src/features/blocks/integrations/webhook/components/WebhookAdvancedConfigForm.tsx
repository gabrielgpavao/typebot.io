import { DropdownList } from '@/components/DropdownList'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { TableList, TableListItemProps } from '@/components/TableList'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useToast } from '@/hooks/useToast'
import {
  Stack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Text,
} from '@chakra-ui/react'
import {
  KeyValue,
  VariableForTest,
  ResponseVariableMapping,
  Webhook,
  WebhookBlock,
} from '@typebot.io/schemas'
import { useState, useMemo } from 'react'
import { executeWebhook } from '../queries/executeWebhookQuery'
import { convertVariablesForTestToVariables } from '../helpers/convertVariablesForTestToVariables'
import { getDeepKeys } from '../helpers/getDeepKeys'
import { QueryParamsInputs, HeadersInputs } from './KeyValueInputs'
import { DataVariableInputs } from './ResponseMappingInputs'
import { VariableForTestInputs } from './VariableForTestInputs'
import { SwitchWithRelatedSettings } from '@/components/SwitchWithRelatedSettings'
import {
  HttpMethod,
  defaultWebhookAttributes,
  defaultWebhookBlockOptions,
} from '@typebot.io/schemas/features/blocks/integrations/webhook/constants'
import { useTranslate } from '@tolgee/react'

type Props = {
  blockId: string
  webhook: Webhook | undefined
  options: WebhookBlock['options']
  onWebhookChange: (webhook: Webhook) => void
  onOptionsChange: (options: WebhookBlock['options']) => void
}

export const WebhookAdvancedConfigForm = ({
  blockId,
  webhook,
  options,
  onWebhookChange,
  onOptionsChange,
}: Props) => {
  const { typebot, save } = useTypebot()
  const [isTestResponseLoading, setIsTestResponseLoading] = useState(false)
  const [testResponse, setTestResponse] = useState<string>()
  const [responseKeys, setResponseKeys] = useState<string[]>([])
  const { showToast } = useToast()
	const { t } = useTranslate()

  const updateMethod = (method: HttpMethod) =>
    onWebhookChange({ ...webhook, method })

  const updateQueryParams = (queryParams: KeyValue[]) =>
    onWebhookChange({ ...webhook, queryParams })

  const updateHeaders = (headers: KeyValue[]) =>
    onWebhookChange({ ...webhook, headers })

  const updateBody = (body: string) => onWebhookChange({ ...webhook, body })

  const updateVariablesForTest = (variablesForTest: VariableForTest[]) =>
    onOptionsChange({ ...options, variablesForTest })

  const updateResponseVariableMapping = (
    responseVariableMapping: ResponseVariableMapping[]
  ) => onOptionsChange({ ...options, responseVariableMapping })

  const updateAdvancedConfig = (isAdvancedConfig: boolean) =>
    onOptionsChange({ ...options, isAdvancedConfig })

  const updateIsCustomBody = (isCustomBody: boolean) =>
    onOptionsChange({ ...options, isCustomBody })

  const executeTestRequest = async () => {
    if (!typebot) return
    setIsTestResponseLoading(true)
    if (!options?.webhook) await save()
    else await save()
    const { data, error } = await executeWebhook(
      typebot.id,
      convertVariablesForTestToVariables(
        options?.variablesForTest ?? [],
        typebot.variables
      ),
      { blockId }
    )
    if (error)
      return showToast({ title: error.name, description: error.message })
    setTestResponse(JSON.stringify(data, undefined, 2))
    setResponseKeys(getDeepKeys(data))
    setIsTestResponseLoading(false)
  }

  const updateIsExecutedOnClient = (isExecutedOnClient: boolean) =>
    onOptionsChange({ ...options, isExecutedOnClient })

  const ResponseMappingInputs = useMemo(
    () =>
      function Component(props: TableListItemProps<ResponseVariableMapping>) {
        return <DataVariableInputs {...props} dataItems={responseKeys} />
      },
    [responseKeys]
  )

  const isCustomBody =
    options?.isCustomBody ?? defaultWebhookBlockOptions.isCustomBody

  return (
    <>
      <SwitchWithRelatedSettings
        label={t("editor.blocks.integration.webhook.settings.advancedConfig.label")}
        initialValue={
          options?.isAdvancedConfig ??
          defaultWebhookBlockOptions.isAdvancedConfig
        }
        onCheckChange={updateAdvancedConfig}
      >
        <SwitchWithLabel
          label={t("editor.blocks.integration.webhook.settings.executeOnClient.label")}
          moreInfoContent={t("editor.blocks.integration.webhook.settings.executeOnClient.infoText")}
          initialValue={
            options?.isExecutedOnClient ??
            defaultWebhookBlockOptions.isExecutedOnClient
          }
          onCheckChange={updateIsExecutedOnClient}
        />
        <HStack justify="space-between">
          <Text>
						{t("editor.blocks.integration.webhook.settings.method.label")}
					</Text>
          <DropdownList
            currentItem={
              (webhook?.method ?? defaultWebhookAttributes.method) as HttpMethod
            }
            onItemSelect={updateMethod}
            items={Object.values(HttpMethod)}
          />
        </HStack>
        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Query params
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<KeyValue>
                initialItems={webhook?.queryParams}
                onItemsChange={updateQueryParams}
                addLabel={t(
									"editor.blocks.integration.webhook.settings.queryParams.addButton.label"
								)}
              >
                {(props) => <QueryParamsInputs {...props} />}
              </TableList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Headers
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<KeyValue>
                initialItems={webhook?.headers}
                onItemsChange={updateHeaders}
                addLabel={t(
									"editor.blocks.integration.webhook.settings.headers.addButton.label"
								)}
              >
                {(props) => <HeadersInputs {...props} />}
              </TableList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Body
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel py={4} as={Stack} spacing="6">
              <SwitchWithLabel
                label="Custom body"
                initialValue={isCustomBody}
                onCheckChange={updateIsCustomBody}
              />
              {isCustomBody && (
                <CodeEditor
                  defaultValue={webhook?.body}
                  lang="json"
                  onChange={updateBody}
                  debounceTimeout={0}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              {t("editor.blocks.integration.webhook.settings.variables.label")}
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<VariableForTest>
                initialItems={options?.variablesForTest}
                onItemsChange={updateVariablesForTest}
                addLabel={t(
									"editor.blocks.integration.webhook.settings.variables.addButton.label"
								)}
              >
                {(props) => <VariableForTestInputs {...props} />}
              </TableList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </SwitchWithRelatedSettings>
      {webhook?.url && (
        <Button
          onClick={executeTestRequest}
          colorScheme="blue"
          isLoading={isTestResponseLoading}
        >
          {t("editor.blocks.integration.webhook.settings.testRequest.label")}
        </Button>
      )}
      {testResponse && (
        <CodeEditor isReadOnly lang="json" value={testResponse} />
      )}
      {(testResponse ||
        (options?.responseVariableMapping &&
          options.responseVariableMapping.length > 0)) && (
        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Save in variables
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<ResponseVariableMapping>
                initialItems={options?.responseVariableMapping}
                onItemsChange={updateResponseVariableMapping}
                addLabel={t(
									"editor.blocks.integration.webhook.settings.variables.addButton.label"
								)}
              >
                {(props) => <ResponseMappingInputs {...props} />}
              </TableList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </>
  )
}
