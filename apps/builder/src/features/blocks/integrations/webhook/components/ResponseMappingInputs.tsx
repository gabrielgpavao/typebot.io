import { AutocompleteInput } from '@/components/inputs/AutocompleteInput'
import { TableListItemProps } from '@/components/TableList'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { Stack, FormControl, FormLabel } from '@chakra-ui/react'
import { Variable, ResponseVariableMapping } from '@typebot.io/schemas'
import { useTranslate } from '@tolgee/react'

export const DataVariableInputs = ({
  item,
  onItemChange,
  dataItems,
}: TableListItemProps<ResponseVariableMapping> & { dataItems: string[] }) => {
	const { t } = useTranslate()
	
  const handleBodyPathChange = (bodyPath: string) =>
    onItemChange({ ...item, bodyPath })
  const handleVariableChange = (variable?: Variable) =>
    onItemChange({ ...item, variableId: variable?.id })

  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <FormControl>
        <FormLabel htmlFor="name">
					{t("editor.blocks.integration.webhook.settings.variables.data.label")}
				</FormLabel>
        <AutocompleteInput
          items={dataItems}
          defaultValue={item.bodyPath}
          onChange={handleBodyPathChange}
          placeholder={t(
						"editor.blocks.integration.webhook.settings.variables.selectData.placeholder"
					)}
          withVariableButton
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="value">
					{t("editor.blocks.integration.webhook.settings.variables.setVariable.label")}
				</FormLabel>
        <VariableSearchInput
          onSelectVariable={handleVariableChange}
          placeholder="Search for a variable"
          initialVariableId={item.variableId}
        />
      </FormControl>
    </Stack>
  )
}
