import { Box, Flex, FlexProps, Icon, useColorMode } from '@chakra-ui/react'
import { MotionValue, useTransform } from 'framer-motion'
import { range } from 'lodash'
import { MdAdd } from 'react-icons/md'
import MotionBox from './MotionBox'

function CirclePip({
  isFirst,
  isSelected,
  onClick,
}: {
  isFirst: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const { colorMode } = useColorMode()
  return (
    <Box
      w="14px"
      h="14px"
      ml={isFirst ? 0 : '8px'}
      borderRadius="full"
      borderWidth={isSelected ? '7px' : '3px'}
      borderColor={colorMode === 'dark' ? 'primary.200' : 'primary.600'}
      transitionProperty="border-width, background"
      transitionDuration="200ms"
      // Hack: fill in subpixel-sized center dot in Android Chrome
      // (probably due to a rounding error when sizing the border)
      bg={
        isSelected
          ? colorMode === 'dark'
            ? 'primary.200'
            : 'primary.600'
          : 'transparent'
      }
      transitionDelay={isSelected ? '0s, 200ms' : '0s'}
      // TODO: a11y
      onClick={onClick}
    />
  )
}

function PlusPip({
  isLast,
  isSelected,
  dragProgressMotionValue,
  onClick,
}: {
  isLast: boolean
  isSelected: boolean
  dragProgressMotionValue: MotionValue
  onClick: () => void
}) {
  const { colorMode } = useColorMode()
  const manualDraftPipWidth = useTransform(
    dragProgressMotionValue,
    [0, 1],
    [0, 14 + 8],
  )
  return (
    <MotionBox
      h="14px"
      color={colorMode === 'dark' ? 'primary.200' : 'primary.600'}
      style={
        isLast
          ? {
              width: manualDraftPipWidth,
              opacity: dragProgressMotionValue,
            }
          : { width: '22px', opacity: isSelected ? 1 : 0.5 }
      }
      initial={false}
      animate={isLast ? {} : { opacity: isSelected ? 1 : 0.5 }}
      overflow="visible"
      onClick={onClick}
    >
      <Icon as={MdAdd} fontSize="20px" ml="5px" mt="-3px" />
    </MotionBox>
  )
}

export default function ActivityPips({
  activityCount,
  page,
  lastPage,
  dragProgressMotionValue,
  onGotoPage,
  onCreateManualEntity,
  ...props
}: {
  activityCount: number
  page: number
  lastPage: number
  dragProgressMotionValue: MotionValue
  onGotoPage: (page: number) => void
  onCreateManualEntity: () => void
} & FlexProps) {
  return (
    <Flex justifySelf="center" {...props}>
      {range(activityCount).map((idx) => (
        <CirclePip
          key={idx}
          isFirst={idx === 0}
          isSelected={idx === page}
          onClick={() => {
            onGotoPage(idx)
          }}
        />
      ))}
      {range(activityCount, lastPage + 1).map((idx) => (
        <PlusPip
          key={`manual-${idx === lastPage ? 'last' : idx}`}
          isLast={idx === lastPage}
          isSelected={idx === page}
          dragProgressMotionValue={dragProgressMotionValue}
          onClick={onCreateManualEntity}
        />
      ))}
    </Flex>
  )
}
