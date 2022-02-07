import { NotFoundPage } from 'layouts/NotFoundPage'
import { PublicTypebot } from 'models'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { TypebotPage, TypebotPageProps } from '../layouts/TypebotPage'
import prisma from '../libs/prisma'

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let typebot: PublicTypebot | undefined
  const isIE = /MSIE|Trident/.test(context.req.headers['user-agent'] ?? '')
  const pathname = context.resolvedUrl.split('?')[0]
  try {
    if (!context.req.headers.host) return { props: {} }
    typebot = await getTypebotFromUrl(context.req.headers.host)
    return {
      props: {
        typebot,
        isIE,
        url: `https://${context.req.headers.host}${pathname}`,
      },
    }
  } catch (err) {
    console.error(err)
  }
  return {
    props: {
      isIE,
      url: `https://${context.req.headers.host}${pathname}`,
    },
  }
}

const getTypebotFromUrl = async (
  hostname: string
): Promise<PublicTypebot | undefined> => {
  const publicId = hostname.split('.').shift()
  if (!publicId) return
  const typebot = await prisma.publicTypebot.findUnique({
    where: { publicId },
  })
  return (typebot as unknown as PublicTypebot | undefined) ?? undefined
}

const App = ({ typebot, ...props }: TypebotPageProps) =>
  typebot ? <TypebotPage {...props} typebot={typebot} /> : <NotFoundPage />
export default App