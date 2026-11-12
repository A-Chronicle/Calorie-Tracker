export type KoalaFrame = 'idle' | 'walk1' | 'walk2' | 'seat' | 'sleep' | 'cheer' | 'grumpy'

interface PixelKoalaProps {
  frame?: KoalaFrame
  size?: number
  className?: string
}

const INK = '#221e1a'
const FUR = '#aaa49a'
const FUR_LIGHT = '#cbc5b9'
const FUR_DARK = '#938d84'
const CREAM = '#efeae1'
const NOSE = '#2b2621'
const EYE = '#181512'
const WHITE = '#fbf8f1'
const BLUSH = '#d99a86'

export default function PixelKoala({ frame = 'idle', size = 80, className = '' }: PixelKoalaProps) {
  const seated = frame === 'seat' || frame === 'sleep'
  const closedEyes = frame === 'sleep' || frame === 'cheer' || frame === 'grumpy'
  const cheer = frame === 'cheer'
  const headY = seated ? 1 : 0
  const leftFootY = frame === 'walk1' ? 17 : 18
  const rightFootY = frame === 'walk2' ? 17 : 18
  const leftArmY = frame === 'walk1' ? 12 : frame === 'walk2' ? 14 : 13
  const rightArmY = frame === 'walk1' ? 14 : frame === 'walk2' ? 12 : 13

  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Koa the koala, ${frame}`}
      className={className}
    >
      <g transform={seated ? 'translate(0 1)' : undefined}>
        <rect x="4" y="13" width="12" height="6" fill={INK} />
        <rect x="5" y="12" width="10" height="7" fill={INK} />
        <rect x="5" y="14" width="10" height="4" fill={FUR} />
        <rect x="6" y="13" width="8" height="5" fill={FUR} />
        <rect x="7" y="15" width="6" height="2" fill={CREAM} />
        <rect x="8" y="14" width="4" height="3" fill={CREAM} />
        <rect x="6" y="17" width="8" height="1" fill={FUR_DARK} />

        {!cheer ? (
          <>
            <rect x="3" y={leftArmY} width="4" height="5" fill={INK} />
            <rect x="4" y={leftArmY + 1} width="2" height="3" fill={FUR} />
            <rect x="13" y={rightArmY} width="4" height="5" fill={INK} />
            <rect x="14" y={rightArmY + 1} width="2" height="3" fill={FUR} />
          </>
        ) : null}

        {!seated ? (
          <>
            <rect x="5" y={leftFootY} width="4" height="2" fill={INK} />
            <rect x="6" y={leftFootY} width="2" height="1" fill={FUR} />
            <rect x="11" y={rightFootY} width="4" height="2" fill={INK} />
            <rect x="12" y={rightFootY} width="2" height="1" fill={FUR} />
          </>
        ) : null}
      </g>

      <g transform={headY ? 'translate(0 1)' : undefined}>
        <rect x="3" y="5" width="14" height="9" fill={INK} />
        <rect x="4" y="4" width="12" height="11" fill={INK} />
        <rect x="2" y="7" width="16" height="4" fill={INK} />
        <rect x="4" y="6" width="12" height="7" fill={FUR} />
        <rect x="5" y="5" width="10" height="9" fill={FUR} />
        <rect x="3" y="8" width="14" height="3" fill={FUR} />
        <rect x="6" y="6" width="8" height="1" fill={FUR_LIGHT} />
        <rect x="5" y="7" width="2" height="1" fill={FUR_LIGHT} />
        <rect x="13" y="7" width="2" height="1" fill={FUR_LIGHT} />

        <rect x="1" y="2" width="7" height="5" fill={INK} />
        <rect x="0" y="3" width="9" height="3" fill={INK} />
        <rect x="2" y="1" width="5" height="7" fill={INK} />
        <rect x="2" y="3" width="5" height="3" fill={FUR_LIGHT} />
        <rect x="1" y="4" width="7" height="1" fill={FUR_LIGHT} />
        <rect x="3" y="2" width="3" height="5" fill={FUR_LIGHT} />
        <rect x="3" y="3" width="3" height="2" fill={CREAM} />
        <rect x="4" y="2" width="1" height="4" fill={CREAM} />

        <rect x="12" y="2" width="7" height="5" fill={INK} />
        <rect x="11" y="3" width="9" height="3" fill={INK} />
        <rect x="13" y="1" width="5" height="7" fill={INK} />
        <rect x="13" y="3" width="5" height="3" fill={FUR_LIGHT} />
        <rect x="12" y="4" width="7" height="1" fill={FUR_LIGHT} />
        <rect x="14" y="2" width="3" height="5" fill={FUR_LIGHT} />
        <rect x="14" y="3" width="3" height="2" fill={CREAM} />
        <rect x="15" y="2" width="1" height="4" fill={CREAM} />

        <rect x="6" y="8" width="8" height="6" fill={CREAM} />
        <rect x="5" y="9" width="10" height="5" fill={CREAM} />
        <rect x="7" y="7" width="6" height="7" fill={CREAM} />

        {closedEyes ? (
          <>
            <rect x="6" y="10" width="2" height="1" fill={EYE} />
            <rect x="12" y="10" width="2" height="1" fill={EYE} />
            {frame === 'grumpy' ? (
              <>
                <rect x="6" y="8" width="2" height="1" fill={EYE} />
                <rect x="12" y="8" width="2" height="1" fill={EYE} />
              </>
            ) : null}
          </>
        ) : (
          <>
            <rect x="6" y="9" width="2" height="2" fill={EYE} />
            <rect x="12" y="9" width="2" height="2" fill={EYE} />
            <rect x="6" y="9" width="1" height="1" fill={WHITE} />
            <rect x="12" y="9" width="1" height="1" fill={WHITE} />
          </>
        )}

        <rect x="8" y="11" width="4" height="2" fill={NOSE} />
        <rect x="9" y="11" width="1" height="1" fill="#4a423a" />
        <rect
          x={cheer || frame === 'grumpy' ? 8 : 9}
          y="13"
          width={cheer || frame === 'grumpy' ? 4 : 2}
          height="1"
          fill={INK}
        />
        <rect x="5" y="12" width="1" height="1" fill={BLUSH} />
        <rect x="14" y="12" width="1" height="1" fill={BLUSH} />
      </g>

      {cheer ? (
        <>
          <rect x="1" y="9" width="4" height="6" fill={INK} />
          <rect x="2" y="10" width="2" height="4" fill={FUR} />
          <rect x="2" y="9" width="2" height="1" fill={FUR_LIGHT} />
          <rect x="15" y="9" width="4" height="6" fill={INK} />
          <rect x="16" y="10" width="2" height="4" fill={FUR} />
          <rect x="16" y="9" width="2" height="1" fill={FUR_LIGHT} />
        </>
      ) : null}
    </svg>
  )
}
