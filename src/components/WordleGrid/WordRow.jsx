import { Flex } from '@chakra-ui/react'
import LetterBox from 'components/WordleGrid/LetterBox'

const Word = ({ word, isSubmitted }) => {
  return (
    <Flex
      flexDir='row'
      gap={1}
    >
      {word.map((letterData, i) => (
        <LetterBox
          key={i}
          letterData={letterData}
          isSubmitted={isSubmitted}
        />
      ))}
    </Flex>
  )
}

export default Word