<template>
  <div>
    <v-btn color="primary" @click="onPDFCreate()">PDF</v-btn>
  </div>
</template>

<script>
import '@/static/Sarabun-Regular-normal.js'
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      pdfOption: {
        orientation: 'p',
        format: 'a4',
        unit: 'px',
        lineHeight: 2,
        putOnlyUsedFonts: true,
      },
    }
  },
  methods: {
    onPDFCreate() {
      // eslint-disable-next-line new-cap
      const pafDoc = new jsPDF()
      pafDoc.setFont('Sarabun-Regular', 'normal')
      pafDoc.setTextColor('#265B7F')
      pafDoc.text('สวัสดีภาษาไทย', 10, 10)
      pafDoc.save('pdf-thai.pdf')
    },
  },
}
</script>
