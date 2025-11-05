import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          borderRadius: '6px',
        }}
      >
        {/* Medical Cross */}
        <div
          style={{
            position: 'relative',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Vertical bar */}
          <div
            style={{
              position: 'absolute',
              width: '6px',
              height: '20px',
              background: '#22c55e',
              borderRadius: '2px',
            }}
          />
          {/* Horizontal bar */}
          <div
            style={{
              position: 'absolute',
              width: '20px',
              height: '6px',
              background: '#22c55e',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
