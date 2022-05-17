import { useEffect, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import 'isomorphic-fetch'
import GameLayout from '@layouts/main'
import Confetti from '@components/Confetti'
import Settings from '@components/Settings'
import Game from '@components/Game'
import GameOverModal from '@components/Modals/GameOver'
import useViewport from '@hooks/useViewport'
import useGameLogic from '@hooks/useGameLogic'
import useOptions from '@hooks/useOptions'
import useStore from '@lib/store'
import { defaultUrl as PRODUCTION_URL } from 'next-seo.config'

const App = ({ wordData }) => {
  const { gameState, launchFireworks } = useStore()
  const [settingsIsOpen, setSettingsIsOpen] = useState(false)
  const { keyHandler } = useGameLogic(wordData)
  const options = useOptions()
  useViewport()

  const { showConfetti } = options

  const {
    isOpen: showGameOverModal,
    onOpen: openGameOverModal,
    onClose: closeGameOverModal
  } = useDisclosure()

  useEffect(() => {
    if (gameState !== 'IN_PROGRESS') openGameOverModal()
  }, [gameState])

  const closeSettings = () => setSettingsIsOpen(false)
  const openSettings = () => setSettingsIsOpen(true)

  return (
    <GameLayout>
      {!settingsIsOpen && (
        <Game
          openSettings={openSettings}
          keyHandler={keyHandler}
          options={options}
        />
      )}

      <Settings
        settingsIsOpen={settingsIsOpen}
        closeSettings={closeSettings}
        options={options}
      />

      {showConfetti && <Confetti launchFireworks={launchFireworks} />}

      <GameOverModal isOpen={showGameOverModal} onClose={closeGameOverModal} />
    </GameLayout>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  const proto = req.headers['x-forwarded-proto'] || req.headers.referer?.split('://')[0] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const DEVELOPMENT_URL = `${proto}://${host}`
  const { NODE_ENV } = process.env

  const SERVER_URL = NODE_ENV === 'production'
    ? PRODUCTION_URL
    : DEVELOPMENT_URL

  const dailyWordUrl = `${SERVER_URL}/api/daily-word`

  const wordData = await fetch(dailyWordUrl)
    .then(r => r.json())
    .then(data => {
      if (data.success) return data.data
      throw new Error('Bad response from server')
    })

  return { props: { wordData } }
}

export default App
