import * as React from 'react'

interface WeeklyMealPlanEmailProps {
  viewUrl: string
  userName?: string
}

export function WeeklyMealPlanEmail({ viewUrl, userName }: WeeklyMealPlanEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header - Forest Green */}
      <div
        style={{
          backgroundColor: '#0A3D2F',
          color: 'white',
          padding: '30px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Bornfidis</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
          Weekly Meal Plan
        </p>
      </div>

      {/* Main Content - Cream Background */}
      <div style={{ padding: '30px', backgroundColor: '#FAF8F2' }}>
        {userName && (
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1A1A1A', margin: '0 0 10px 0' }}>
            Hello {userName},
          </p>
        )}
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1A1A1A', margin: '0 0 15px 0' }}>
          Your weekly nourishment is ready.
        </p>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', margin: 0 }}>
          We've prepared a personalized 7-day meal plan with shopping list, crafted with
          wisdom and care for your household.
        </p>
      </div>

      {/* Scripture Divider - Gold Border, Sage Background */}
      <div
        style={{
          borderTop: '2px solid #D4AF37',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#E7EFE5',
        }}
      >
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '16px',
            color: '#0A3D2F',
            margin: '10px 0',
          }}
        >
          "Wisdom prepares the table." — Proverbs 9:1
        </p>
      </div>

      {/* CTA Button */}
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <a
          href={viewUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#0A3D2F',
            color: 'white',
            padding: '14px 28px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          View Your Meal Plan
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          borderTop: '1px solid #ddd',
        }}
      >
        <p style={{ margin: '5px 0' }}>Bornfidis Smart Meal Planner</p>
        <p style={{ margin: '5px 0' }}>Adapt. Explore. Empower.</p>
      </div>
    </div>
  )
}


