import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Meal {
  breakfast: string
  lunch: string
  dinner: string
}

interface DayPlan {
  day: string
  meals: Meal
  notes?: string
}

interface ShoppingListItem {
  category: string
  items: string[]
}

interface MealPlanData {
  plan: DayPlan[]
  shoppingList: ShoppingListItem[]
}

export function generateMealPlanPDF(mealPlanData: MealPlanData): Uint8Array {
  // Brand colors (as tuples for jsPDF)
  const colors = {
    green: [10, 61, 47] as [number, number, number], // #0A3D2F
    gold: [212, 175, 55] as [number, number, number], // #D4AF37
    sage: [135, 169, 107] as [number, number, number], // #87A96B
    cream: [250, 248, 242] as [number, number, number], // #FAF8F2
    black: [26, 26, 26] as [number, number, number], // #1A1A1A
  }

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Page 1: Bornfidis Cover
  doc.setFillColor(...colors.cream)
  doc.rect(0, 0, 210, 297, 'F')

  // Add title
  doc.setFont('times', 'bold')
  doc.setTextColor(...colors.green)
  doc.setFontSize(32)
  doc.text('Bornfidis', 105, 80, { align: 'center' })

  doc.setFontSize(24)
  doc.text('Weekly Meal Plan', 105, 100, { align: 'center' })

  // Add subtitle
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(...colors.black)
  doc.text('Personalized 7-Day Meal Plan & Shopping List', 105, 120, { align: 'center' })

  // Add scripture
  doc.setFont('times', 'italic')
  doc.setFontSize(16)
  doc.setTextColor(...colors.sage)
  doc.text('"Wisdom prepares the table."', 105, 150, { align: 'center' })
  doc.setFontSize(12)
  doc.text('— Proverbs 9:1', 105, 165, { align: 'center' })

  // Add decorative line
  doc.setDrawColor(...colors.gold)
  doc.setLineWidth(0.5)
  doc.line(50, 180, 160, 180)

  // Add date
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...colors.black)
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`Generated: ${today}`, 105, 200, { align: 'center' })

  // Add new page for meal plan
  doc.addPage()

  // Page 2+: 7-Day Meal Plan Table
  doc.setFont('times', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...colors.green)
  doc.text('🌿 7-Day Meal Plan', 105, 20, { align: 'center' })

  // Prepare table data
  const tableData = mealPlanData.plan.map((dayPlan) => [
    `🌿 ${dayPlan.day}`,
    dayPlan.meals.breakfast,
    dayPlan.meals.lunch,
    dayPlan.meals.dinner,
  ])

  // Create meal plan table
  autoTable(doc, {
    head: [['Day', 'Breakfast', 'Lunch', 'Dinner']],
    body: tableData,
    startY: 30,
    theme: 'grid',
    headStyles: {
      fillColor: colors.gold,
      textColor: colors.black,
      fontStyle: 'bold',
      fontSize: 11,
      font: 'helvetica',
    },
    bodyStyles: {
      textColor: colors.black,
      fontSize: 9,
      font: 'helvetica',
    },
    alternateRowStyles: {
      fillColor: colors.cream,
    },
    columnStyles: {
      0: {
        cellWidth: 30,
        fontStyle: 'bold',
        textColor: colors.green,
      },
      1: { cellWidth: 50 },
      2: { cellWidth: 50 },
      3: { cellWidth: 50 },
    },
    styles: {
      lineColor: colors.green,
      lineWidth: 0.1,
    },
    margin: { top: 30, left: 10, right: 10 },
  })

  // Add notes if available
  const notesDays = mealPlanData.plan.filter((day) => day.notes)
  if (notesDays.length > 0) {
    let currentY = (doc as any).lastAutoTable.finalY + 15

    if (currentY > 250) {
      doc.addPage()
      currentY = 20
    }

    doc.setFont('times', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...colors.green)
    doc.text('Notes & Tips', 10, currentY)

    currentY += 8
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(...colors.black)

    notesDays.forEach((dayPlan) => {
      if (currentY > 270) {
        doc.addPage()
        currentY = 20
      }
      doc.text(`💡 ${dayPlan.day}: ${dayPlan.notes}`, 15, currentY)
      currentY += 7
    })
  }

  // Final Page: Shopping List
  doc.addPage()

  doc.setFont('times', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...colors.green)
  doc.text('Shopping List', 105, 20, { align: 'center' })

  // Create shopping list tables (one per category)
  let startY = 30
  mealPlanData.shoppingList.forEach((category) => {
    if (startY > 250) {
      doc.addPage()
      startY = 20
    }

    const categoryItems = category.items.map((item) => [item])

    autoTable(doc, {
      head: [[category.category]],
      body: categoryItems,
      startY: startY,
      theme: 'striped',
      headStyles: {
        fillColor: colors.gold,
        textColor: colors.black,
        fontStyle: 'bold',
        fontSize: 11,
        font: 'helvetica',
      },
      bodyStyles: {
        textColor: colors.green,
        fontSize: 9,
        font: 'helvetica',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
      styles: {
        lineColor: colors.green,
        lineWidth: 0.1,
      },
      margin: { top: startY, left: 10, right: 10 },
    })

    startY = (doc as any).lastAutoTable.finalY + 10
  })

  // Add footer on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...colors.black)
    doc.text(
      `Bornfidis Smart Meal Planner - Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    )
  }

  // Return PDF as ArrayBuffer for server-side use
  return new Uint8Array(doc.output('arraybuffer') as ArrayBuffer)
}

