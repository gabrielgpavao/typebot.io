import { WithVariableContent } from '@/features/graph/components/nodes/block/WithVariableContent'
import { Text } from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'
import { FileInputBlock } from '@typebot.io/schemas'

type Props = {
  options: FileInputBlock['options']
}

export const FileInputContent = ({ options }: Props) => {
	const { t } = useTranslate()

  return options?.variableId ? (
    <WithVariableContent variableId={options.variableId} />
  ) : (
    <Text noOfLines={1} pr="6">
      {
				options?.isMultipleAllowed
					? t("editor.blocks.inputs.file.collectMultiple.label")
					: t("editor.blocks.inputs.file.collectSingle.label")
			}
    </Text>
  )
}
