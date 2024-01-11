<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-if="!reportDetail">
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span
        class="mr-1"
        @click="$router.push('/projects/reports')"
      >
        <cp-link> รายงานทั้งหมด </cp-link>
      </span>
      /
      <span class="mx-1 cp-text-disable"> ... </span>
    </div>

    <!-- Page Loading -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex">
          <v-sheet
            width="300"
            height="30"
            color="grey lighten-3"
            class="mt-6"
          />
          <v-sheet
            width="70"
            height="30"
            color="grey lighten-3"
            class="mt-6 ml-4"
          />
        </div>
        <v-sheet
          width="200"
          height="30"
          color="grey lighten-3"
          class="mt-6"
        />
        <v-sheet
          width="100%"
          height="400"
          color="grey lighten-3"
          class="mt-6"
        />
      </v-col>
    </v-row>
  </div>

  <div v-else>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span
        class="mr-1"
        @click="$router.push('/projects/reports')"
      >
        <cp-link> รายงานทั้งหมด </cp-link>
      </span>
      /
      <span class="mx-1 cp-text-disable">
        รายงานของ รายการตรวจที่
        {{ reportDetail.project_detail.inspection_no }}
      </span>
    </div>

    <!-- Page Action -->
    <v-row
      v-if="reportDetail"
      class="mt-2"
    >
      <v-col
        cols="12"
        class="d-lg-none"
      >
        <div class="cp-header-2 cp-bold">
          รายงานของ รายการตรวจที่
          {{ reportDetail.project_detail.inspection_no }}
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <div class="cp-header-2 cp-bold hidden-md-and-down mr-4">
            รายงานของ รายการตรวจที่
            {{ reportDetail.project_detail.inspection_no }}
          </div>
          <div>
            <div v-if="reportDetail.report_status == 'in-progress'">
              <v-chip
                label
                color="warning"
              >
                กำลังดำเนินการ
              </v-chip>
            </div>
            <div v-else-if="reportDetail.report_status == 'approval'">
              <div class="d-flex align-center">
                <v-chip
                  label
                  color="info"
                  class="mr-4"
                >
                  รอการยืนยัน
                </v-chip>

                <v-btn
                  v-if="role == 'Admin' ||
                    role == 'Project Manager' ||
                    role == 'Supervisor'
                  "
                  outlined
                  elevation="0"
                  color="primary"
                  class="mr-4"
                  @click="cancelApproval.dialog = true"
                >
                  <v-icon left>
                    mdi-file-document-refresh-outline
                  </v-icon>
                  ยกเลิก
                </v-btn>

                <v-avatar
                  size="40"
                  color="primary"
                >
                  <v-img
                    v-if="reportDetail.checker_supervisor.avatar_path"
                    :src="reportDetail.checker_supervisor.avatar_path"
                  />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
                <div class="ml-4">
                  <div class="cp-semibold cp-body">
                    ผู้ยืนยันหลัก
                  </div>
                  <div class="cp-caption cp-text-description truncate">
                    ({{ reportDetail.checker_supervisor.code_name }})
                    {{
                      reportDetail.checker_supervisor.first_name +
                        ' ' +
                        reportDetail.checker_supervisor.last_name
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="reportDetail.report_status == 'approved'">
              <div class="d-flex align-center">
                <v-chip
                  label
                  color="success"
                  class="mr-4"
                >
                  รายงานได้รับการยืนยัน
                </v-chip>
                <v-avatar
                  size="40"
                  color="primary"
                >
                  <v-img
                    v-if="reportDetail.approved_by.avatar_path"
                    :src="reportDetail.approved_by.avatar_path"
                  />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
                <div class="ml-4">
                  <div class="cp-caption truncate">
                    <span class="cp-semibold">ยืนยันโดย:</span>
                    <span class="cp-text-description">
                      ({{ reportDetail.approved_by.code_name }})
                      {{
                        reportDetail.approved_by.first_name +
                          ' ' +
                          reportDetail.approved_by.last_name
                      }}
                    </span>
                  </div>
                  <div class="cp-caption cp-text-description">
                    <v-icon small>
                      mdi-calendar-clock-outline
                    </v-icon>
                    {{ formatDate(reportDetail.approved_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-spacer />
          <div>
            <div v-if="locationList.length > 0 && systemList.length > 0">
              <v-btn
                v-if="role != 'Checker' && reportDetail.report_status == 'in-progress'
                "
                :loading="approvalReport.checkLoading"
                color="primary"
                elevation="0"
                @click="onBeforeApprovalReport()"
              >
                <v-icon left>
                  mdi-file-sign
                </v-icon>
                ขอการยืนยันรายงาน
              </v-btn>
            </div>
            <div v-if="reportDetail.report_status == 'approval'">
              <v-btn
                v-if="accountId == reportDetail.checker_supervisor.account_id ||
                  role == 'Project Manager' ||
                  role == 'Supervisor'
                "
                color="success"
                elevation="0"
                @click="confirmReport.dialog = true"
              >
                <v-icon left>
                  mdi-file-document-check-outline
                </v-icon>
                ยืนยันรายงาน
              </v-btn>
            </div>

            <v-btn
              v-if="reportDetail.report_status == 'approved'"
              :loading="downloadPDFLoading"
              color="primary"
              outlined
              large
              @click="createPDF()"
            >
              <v-icon class="mr-2">
                mdi-file-star-outline
              </v-icon>
              สร้างรายงาน (PDF)
            </v-btn>
          </div>
        </div>

        <div class="d-flex align-center mb-6">
          <b>รายการตรวจ:</b>
          <cp-link>
            <span
              class="ml-1 primary--text"
              @click="
                $router.push(
                  `/projects/list/detail/inspection?id=${reportDetail.inspection_id}`
                )
              "
            >
              ดูรายการตรวจของรายงานนี้
            </span>
          </cp-link>

          <b class="ml-4">วันที่เข้าตรวจ:</b>
          <span class="cp-text-description ml-1">
            {{ formatDate(reportDetail.project_detail.working_date) }}
          </span>
        </div>
      </v-col>
    </v-row>

    <!-- Page Header -->
    <cp-card class="page-a4">
      <v-img
        :src="require('@/assets/images/header-page-2.png')"
        width="100%"
      />

      <div class="my-6">
        <v-img
          v-if="projectFile.main"
          :src="projectFile.main"
          width="100%"
          height="500px"
          aspect-ratio="1.4"
        />
        <v-card
          v-else
          flat
          color="grey lighten-4"
          width="100%"
          height="500px"
        />
      </div>

      <!-- Project Detail -->
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <div class="detail-title">
            ข้อมูล โปรเจค
          </div>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              ชื่อโปรเจค
            </v-col>
            <v-col cols="9">
              {{ reportDetail.project_detail.project_name }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              ตรวจรอบที่
            </v-col>
            <v-col cols="9">
              {{ reportDetail.project_detail.inspection_no }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              วันที่เข้าตรวจ
            </v-col>
            <v-col cols="9">
              {{ formatDate(reportDetail.project_detail.working_date) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1" />
        <v-col
          cols="12"
          sm="5"
        >
          <div class="detail-title">
            ข้อมูล ลูกค้า
          </div>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              ชื่อ
            </v-col>
            <v-col cols="9">
              {{ reportDetail.customer_detail.name }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              เบอร์โทร
            </v-col>
            <v-col cols="9">
              {{
                reportDetail.customer_detail.phone
                  ? formatPhoneNumber(reportDetail.customer_detail.phone)
                  : '-'
              }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              อีเมล
            </v-col>
            <v-col cols="9">
              <div v-if="reportDetail.customer_detail.email">
                <div v-if="reportDetail.customer_detail.email.split(',')[0]">
                  {{ reportDetail.customer_detail.email.split(",")[0] }}
                </div>
                <div v-if="reportDetail.customer_detail.email.split(',')[1]">
                  {{ reportDetail.customer_detail.email.split(",")[1] }}
                </div>
                <div v-if="reportDetail.customer_detail.email.split(',')[2]">
                  {{ reportDetail.customer_detail.email.split(",")[2] }}
                </div>
              </div>
              <div v-else>
                -
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <div
            class="detail-title"
          >
            ข้อมูล {{ reportDetail.type_detail.project_type }}
          </div>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              ประเภท
            </v-col>
            <v-col cols="9">
              {{ reportDetail.type_detail.project_type }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              เลขที่
            </v-col>
            <v-col cols="9">
              {{ reportDetail.type_detail.type_address || '-' }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              พื้นที่ใช้สอย
            </v-col>
            <v-col cols="9">
              <span v-if="reportDetail.type_detail.type_usable_area">
                {{ reportDetail.type_detail.type_usable_area }} ตร.ม.
              </span>
              <span v-else>-</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1" />
        <v-col
          cols="12"
          sm="5"
        >
          <div
            class="detail-title"
          >
            ข้อมูล เจ้าหน้าที่โครงการ
          </div>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              ชื่อ
            </v-col>
            <v-col cols="9">
              {{ reportDetail.coordinator_detail.name || '-' }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              เบอร์โทร
            </v-col>
            <v-col cols="9">
              {{
                reportDetail.coordinator_detail.phone
                  ? formatPhoneNumber(reportDetail.coordinator_detail.phone)
                  : '-'
              }}
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="my-3"
          >
            <v-col cols="3">
              อีเมล
            </v-col>
            <v-col cols="9">
              <div v-if="reportDetail.coordinator_detail.email">
                <div v-if="reportDetail.coordinator_detail.email.split(',')[0]">
                  {{ reportDetail.coordinator_detail.email.split(',')[0] }}
                </div>
                <div v-if="reportDetail.coordinator_detail.email.split(',')[1]">
                  {{ reportDetail.coordinator_detail.email.split(',')[1] }}
                </div>
                <div v-if="reportDetail.coordinator_detail.email.split(',')[2]">
                  {{ reportDetail.coordinator_detail.email.split(',')[2] }}
                </div>
              </div>
              <div v-else>
                -
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </cp-card>

    <!-- Page Plan -->
    <cp-card class="page-a4 mt-6">
      <div class="detail-title">
        แปลน
      </div>
      <div class="detail-plan">
        <div
          v-if="!projectFile.plan1"
          class="text-center pt-6"
        >
          <div class="cp-title cp-text-description">
            ไม่มีข้อมูลแปลน
          </div>
        </div>
        <v-row v-else>
          <v-col
            v-if="projectFile.plan1"
            cols="6"
          >
            <v-img
              :src="projectFile.plan1"
              width="100%"
              contain
            />
          </v-col>
          <v-col
            v-if="projectFile.plan2"
            cols="6"
          >
            <v-img
              :src="projectFile.plan2"
              width="100%"
              contain
            />
          </v-col>
          <v-col
            v-if="projectFile.plan3"
            cols="6"
          >
            <v-img
              :src="projectFile.plan3"
              width="100%"
              contain
            />
          </v-col>
          <v-col
            v-if="projectFile.plan4"
            cols="6"
          >
            <v-img
              :src="projectFile.plan4"
              width="100%"
              contain
            />
          </v-col>
        </v-row>
      </div>
    </cp-card>

    <!-- Page Note -->
    <cp-card
      v-if="noteGroupPreview.length > 0"
      class="page-a4 mt-6"
    >
      <div class="detail-title mb-6">
        <span class="error--text">หมายเหตุ</span>
      </div>
      <div>
        <v-card
          v-for="(item, index) in noteGroupPreview"
          :key="index + 'noteGroupPreview'"
          flat
        >
          <div
            v-for="(item, index) in item"
            :key="index + 'item'"
          >
            <div
              v-if="item.type === 'title'"
              class="cp-title mb-4 mt-6 pt-6"
            >
              {{ item.text }}
            </div>
            <div
              v-else
              class="cp-body my-4 cp-text-description"
            >
              {{ item.text }}
            </div>
          </div>
        </v-card>
      </div>
    </cp-card>

    <!-- Page Location -->
    <cp-card class="page-a4 mt-6">
      <div
        v-if="locationList.length == 0"
        class="no-deflect"
      >
        Location ยังไม่มี Deflect
      </div>
      <div
        v-for="(list, index) in locationList"
        :key="index + 'locationList'"
      >
        <div class="detail-title mb-6">
          <span class="cp-text-primary">
            Location: {{ list.location_name }}
          </span>
        </div>
        <v-data-table
          :headers="headers"
          :items="list.deflect_list"
          :footer-props="{ 'items-per-page-options': [5, 10] }"
          :items-per-page="5"
          class="elevation-0"
        >
          <template #item.image_path="{ item }">
            <v-img
              :src="item.image_path"
              aspect-ratio="1.4"
              class="my-4 grey lighten-2"
              min-width="150"
              contain
            />
          </template>

          <template #item.deflect_status="{ item }">
            <v-card
              min-width="200"
              color="transparent"
              class="d-flex rounded-0"
              flat
            >
              <v-sheet
                :color="Number(item.deflect_status) === 0 || item.deflect_status === null
                  ? 'grey lighten-2'
                  : 'success'
                "
                width="100"
                height="36"
                class="d-flex align-center justify-center"
              >
                <div
                  v-if="Number(item.deflect_status) === 0 || item.deflect_status === null
                  "
                  class="cp-body"
                >
                  ผ่าน
                </div>
                <div
                  v-else
                  class="cp-body white--text"
                >
                  ผ่าน
                </div>
              </v-sheet>

              <v-sheet
                :color="Number(item.deflect_status) === 1 || item.deflect_status === null
                  ? 'grey lighten-2'
                  : 'error'
                "
                width="100"
                height="36"
                class="d-flex align-center justify-center"
              >
                <div
                  v-if="Number(item.deflect_status) === 1 || item.deflect_status === null
                  "
                  class="cp-body"
                >
                  ไม่ผ่าน
                </div>
                <div
                  v-else
                  class="cp-body white--text"
                >
                  ไม่ผ่าน
                </div>
              </v-sheet>
            </v-card>
          </template>

          <template #item.deflect_detail="{ item }">
            <v-card
              min-width="150"
              max-width="150"
              color="transparent"
              flat
            >
              <p v-if="item.deflect_detail">
                {{ item.deflect_detail }}
              </p>
              <p
                v-else
                class="cp-text-disable"
              >
                ไม่มีรายละเอียด
              </p>
            </v-card>
          </template>

          <template #item.created_at="{ item }">
            <v-card
              max-width="130"
              min-width="130"
              color="transparent"
              flat
            >
              <div>
                {{ item.created_by.code_name }}
              </div>
              <div>
                {{ formatDateShot(item.created_at) }}
              </div>
            </v-card>
          </template>

          <template #item.update_status_at="{ item }">
            <v-card
              max-width="130"
              min-width="130"
              color="transparent"
              flat
            >
              <div>
                {{ item.update_status_by.code_name }}
              </div>
              <div>
                {{ formatDateShot(item.update_status_at) }}
              </div>
            </v-card>
          </template>

          <template #no-data>
            <div>รายการ Deflect ผ่านหมดแล้ว</div>
          </template>
        </v-data-table>
      </div>
    </cp-card>

    <!-- Page System -->
    <cp-card class="page-a4 mt-6">
      <div
        v-if="systemList.length == 0"
        class="no-deflect"
      >
        System ยังไม่มี Deflect
      </div>
      <div
        v-for="(list, index) in systemList"
        :key="index + 'systemList'"
      >
        <div class="detail-title mb-6">
          <span class="cp-text-primary"> System: {{ list.system_name }} </span>
        </div>
        <v-data-table
          :headers="headers"
          :items="list.deflect_list"
          :footer-props="{ 'items-per-page-options': [5, 10] }"
          :items-per-page="5"
          class="elevation-0"
        >
          <template #item.image_path="{ item }">
            <v-img
              :src="item.image_path"
              aspect-ratio="1.4"
              class="my-4 grey lighten-2"
              min-width="150"
              contain
            />
          </template>

          <template #item.deflect_status="{ item }">
            <v-card
              min-width="200"
              color="transparent"
              class="d-flex rounded-0"
              flat
            >
              <v-sheet
                :color="Number(item.deflect_status) === 0 || item.deflect_status === null
                  ? 'grey lighten-2'
                  : 'success'
                "
                width="100"
                height="36"
                class="d-flex align-center justify-center"
              >
                <div
                  v-if="Number(item.deflect_status) === 0 || item.deflect_status === null
                  "
                  class="cp-body"
                >
                  ผ่าน
                </div>
                <div
                  v-else
                  class="cp-body white--text"
                >
                  ผ่าน
                </div>
              </v-sheet>

              <v-sheet
                :color="Number(item.deflect_status) === 1 || item.deflect_status === null
                  ? 'grey lighten-2'
                  : 'error'
                "
                width="100"
                height="36"
                class="d-flex align-center justify-center"
              >
                <div
                  v-if="Number(item.deflect_status) === 1 || item.deflect_status === null
                  "
                  class="cp-body"
                >
                  ไม่ผ่าน
                </div>
                <div
                  v-else
                  class="cp-body white--text"
                >
                  ไม่ผ่าน
                </div>
              </v-sheet>
            </v-card>
          </template>

          <template #item.deflect_detail="{ item }">
            <v-card
              min-width="150"
              max-width="150"
              color="transparent"
              flat
            >
              <p v-if="item.deflect_detail">
                {{ item.deflect_detail }}
              </p>
              <p
                v-else
                class="cp-text-disable"
              >
                ไม่มีรายละเอียด
              </p>
            </v-card>
          </template>

          <template #item.created_at="{ item }">
            <v-card
              max-width="130"
              min-width="130"
              color="transparent"
              flat
            >
              <div>
                {{ item.created_by.code_name }}
              </div>
              <div>
                {{ formatDateShot(item.created_at) }}
              </div>
            </v-card>
          </template>

          <template #item.update_status_at="{ item }">
            <v-card
              max-width="130"
              min-width="130"
              color="transparent"
              flat
            >
              <div>
                {{ item.update_status_by.code_name }}
              </div>
              <div>
                {{ formatDateShot(item.update_status_at) }}
              </div>
            </v-card>
          </template>
        </v-data-table>
      </div>
    </cp-card>

    <!-- Modal -->
    <!-- Report Approval -->
    <v-dialog
      v-model="approvalReport.dialog"
      :persistent="approvalReport.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ขอการยืนยันรายงาน
          <v-spacer />
          <v-btn
            :disabled="approvalReport.loading"
            icon
            class="mt-n4 mr-n4"
            @click="approvalReport.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            <div class="warning--text pb-4">
              การขอยืนยันจะทำให้ไม่สามารถแก้ไขข้อมูลทั้งหมดที่เกี่ยวข้องกับโปรเจคนี้ได้โปรดตรวจสอบข้อมูลก่อนขอยืนยัน
            </div>
            <cp-label>หัวหน้าทีมตรวจของรายการตรวจนี้</cp-label>
            <v-card
              outlined
              class="pa-2"
            >
              <div class="d-flex align-center">
                <v-avatar
                  size="55"
                  color="primary"
                >
                  <v-img
                    v-if="reportDetail.checker_supervisor.avatar_path"
                    :src="reportDetail.checker_supervisor.avatar_path"
                  />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
                <div class="ml-4">
                  <div class="cp-semibold cp-subtitle">
                    {{ reportDetail.checker_supervisor.code_name }}
                  </div>
                  <div>
                    {{
                      reportDetail.checker_supervisor.first_name +
                        ' ' +
                        reportDetail.checker_supervisor.last_name
                    }}
                  </div>
                </div>
              </div>
            </v-card>
          </div>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="approvalReport.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onConfirmReportApproval()"
            >
              <div class="cp-text-capitalize">
                ดำเนินการ
              </div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Cancel Report Approval -->
    <v-dialog
      v-model="cancelApproval.dialog"
      :persistent="cancelApproval.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ยกเลิกยืนยันรายงาน
          <v-spacer />
          <v-btn
            :disabled="cancelApproval.loading"
            icon
            class="mt-n4 mr-n4"
            @click="cancelApproval.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          การยกเลิกการยืนยันรายงานจะทำให้สามารถแก้ไขข้อมูลรายงานได้
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="cancelApproval.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onCancelReportApproval()"
            >
              <div class="cp-text-capitalize">
                ยืนยัน
              </div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm Report -->
    <v-dialog
      v-model="confirmReport.dialog"
      :persistent="confirmReport.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ยืนยันรายงาน
          <v-spacer />
          <v-btn
            :disabled="confirmReport.loading"
            icon
            class="mt-n4 mr-n4"
            @click="confirmReport.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          การยืนยันรายงานจะทำให้สถานะของโปรเจคเสร็จสิ้นและไม่สามารถแก้ไขข้อมูลในรายการตรวจได้อีก
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="confirmReport.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onConfirmReportApproved()"
            >
              <div class="cp-text-capitalize">
                ยืนยัน
              </div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create PDF Progress Modal -->
    <v-dialog
      v-model="createPDFModal.dialog"
      persistent
      max-width="450px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title> สร้างไฟล์ PDF </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <b>ตั้งค่าหน้าแรก</b>
            </v-col>
            <v-col cols="8">
              <b
                v-if="!createPDFModal.setupPageDetail"
                class="cp-text-disable"
              >
                กำลังดำเนินการ...
              </b>
              <b
                v-else
                class="success--text"
              >เสร็จสิ้น</b>
            </v-col>
            <v-col cols="4">
              <b>ตั้งค่าหน้า Location</b>
            </v-col>
            <v-col cols="8">
              Deflect:
              <b class="primary--text cp-title">{{
                createPDFModal.allLocationDeflect
              }}</b>
              ดำเนินการแล้ว
              <b class="success--text cp-title">{{
                createPDFModal.setupPageLocation
              }}</b>
            </v-col>
            <v-col cols="4">
              <b>ตั้งค่าหน้า System</b>
            </v-col>
            <v-col cols="8">
              Deflect
              <b class="primary--text cp-title">
                {{ createPDFModal.allSystemDeflect }}
              </b>
              ดำเนินการแล้ว
              <b class="success--text cp-title">{{
                createPDFModal.setupPageSystem
              }}</b>
            </v-col>
            <!-- <v-col cols="4"> <b>บันทึกไฟล์</b> </v-col>
            <v-col cols="8">
              <b v-if="!createPDFModal.savePDF" class="cp-text-disable">
                กำลังดำเนินการ...
              </b>
              <b v-else class="success--text">เสร็จสิ้น</b>
            </v-col> -->
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import '@/static/Sarabun-Regular-normal.js'
import '@/static/Sarabun-SemiBold-normal.js'
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      reportDetail: null,
      projectFile: {
        main: null,
        plan1: null,
        plan2: null,
        plan3: null,
        plan4: null,
      },
      noteGroupList: [],
      locationListStatus: false,
      locationList: [],
      systemListStatus: false,
      systemList: [],
      approvalReport: {
        loading: false,
        dialog: false,
        checkLoading: false,
      },
      cancelApproval: {
        loading: false,
        dialog: false,
      },
      confirmReport: {
        loading: false,
        dialog: false,
      },
      downloadPDFLoading: false,
      createPDFModal: {
        dialog: false,
        setupPageDetail: false,
        allLocationDeflect: 0,
        setupPageLocation: 0,
        allSystemDeflect: 0,
        setupPageSystem: 0,
        savePDF: false,
      },
      headers: [
        { text: 'Deflect', sortable: false, value: 'image_path' },
        { text: 'สถานะ', sortable: false, value: 'deflect_status' },
        { text: 'รายละเอียด', sortable: false, value: 'deflect_detail' },
        { text: 'สร้างโดย', sortable: false, value: 'created_at' },
        { text: 'บันทึกสถานะ', sortable: false, value: 'update_status_at' },
      ],
      noteGroupPreview: []
    }
  },

  head: {
    title: 'Report Detail',
  },

  computed: {
    ...mapState('user', ['accountId', 'role', 'appRoleList']),
  },

  watch: {
    reportDetail(newValue) {
      if (newValue) {
        this.onGetInspectionNoteList()
        this.onGetLocationList()
        this.onGetSystemList()
      }
    },
    'createPDFModal.dialog'(newValue) {
      if (!newValue) {
        this.createPDFModal.setupPageDetail = false
        this.createPDFModal.setupPageLocation = 0
        this.createPDFModal.allLocationDeflect = 0
        this.createPDFModal.setupPageSystem = 0
        this.createPDFModal.allSystemDeflect = 0
        this.createPDFModal.savePDF = false
      }
    },
  },

  created() {
    this.onGetReportDetail()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),

    formatDateMax(dateStr) {
      const result = moment(dateStr)
        .locale('th')
        .format('DD/MMMM/yyyy เวลา HH:mm')
      return result
    },

    formatDate(dateStr) {
      const result = moment(dateStr).locale('th').format('DD/MMMM/yyyy')
      return result
    },

    formatDatePDF(dateStr) {
      const result = moment(dateStr).locale('th').format('DD MMMM yyyy')
      return result
    },

    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    },

    formatDateShot(dateStr) {
      if (dateStr) {
        const result = moment(dateStr).locale('th').format('DD MMM YY - HH:mm')
        return result
      } else {
        return '-'
      }
    },

    async onGetReportDetail() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/detail`,
            {
              report_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              for (let i = 0; i < data.data.project_file.length; i++) {
                if (data.data.project_file[i].file_type === 'main') {
                  this.projectFile.main = data.data.project_file[i].image_path
                } else if (data.data.project_file[i].file_type === 'plan1') {
                  this.projectFile.plan1 = data.data.project_file[i].image_path
                } else if (data.data.project_file[i].file_type === 'plan2') {
                  this.projectFile.plan2 = data.data.project_file[i].image_path
                } else if (data.data.project_file[i].file_type === 'plan3') {
                  this.projectFile.plan3 = data.data.project_file[i].image_path
                } else if (data.data.project_file[i].file_type === 'plan4') {
                  this.projectFile.plan4 = data.data.project_file[i].image_path
                }
              }
              this.reportDetail = data.data
            }
          })
          .catch(() => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: 'ไม่มีรายการ รายงานนี้แล้ว',
            })
            this.$router.push('/projects/reports')
          })
      }
    },

    async onGetInspectionNoteList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/get-note`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              data.data.sort((a, b) => a.item_number - b.item_number)
              this.noteGroupList = data.data
              this.previewNoteGroupList(data.data)
            }
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data,
            })
          })
      }
    },

    async onGetLocationList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.locationListStatus = false
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/location/list`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              data.data.sort((a, b) => a.item_number - b.item_number)
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].deflect_list.sort((a, b) => a.id - b.id)
              }
              this.locationList = data.data
              this.locationListStatus = true
            }
          })
          .catch(() => {
            this.approvalReport.checkLoading = false
          })
      }
    },

    async onGetSystemList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.systemListStatus = false
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/system/list`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              data.data.sort((a, b) => a.item_number - b.item_number)
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].deflect_list.sort((a, b) => a.id - b.id)
              }
              this.systemList = data.data
              this.systemListStatus = true
            }
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data.data,
            })
          })
      }
    },

    async onBeforeApprovalReport() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.approvalReport.checkLoading = true
        try {
          const response = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/before-approval`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          const data = response.data.data
          this.approvalReport.checkLoading = false
          this.onBeforeApprovalReportChecking(
            data.locationDeflect,
            data.systemDeflect
          )
        } catch (error) {
          this.approvalReport.checkLoading = false
          this.onNotify({
            notifyValue: true,
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            message: error.response,
          })
        }
      }
    },

    onBeforeApprovalReportChecking(locationDeflect, systemDeflect) {
      if (!locationDeflect || !systemDeflect) {
        this.onNotify({
          notifyValue: true,
          type: 'warning',
          title: 'แจ้งเตือน',
          message: 'มีรายการ Deflect ที่ยังไม่มีสถานะ กรุณาตรวจสอบข้อมูล',
        })
        this.onGetLocationList()
        this.onGetSystemList()
      } else {
        this.approvalReport.dialog = true
      }
    },

    async onConfirmReportApproval() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.approvalReport.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/approval`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            this.onGetReportDetail()
            this.approvalReport.loading = false
            this.approvalReport.dialog = false
          })
          .catch(() => {
            this.approvalReport.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message:
                'ไม่พบข้อมูลรายงานนี้ อาจมีผู้ใช้งานท่านอื่นลบรายการตรวจแล้ว',
            })
          })
      }
    },

    async onCancelReportApproval() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.cancelApproval.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/approval-cancel`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            this.onGetReportDetail()
            this.cancelApproval.loading = false
            this.cancelApproval.dialog = false
          })
          .catch(() => {
            this.cancelApproval.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message:
                'ไม่พบข้อมูลรายงานนี้ อาจมีผู้ใช้งานท่านอื่นลบรายการตรวจแล้ว',
            })
          })
      }
    },

    async onConfirmReportApproved() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.confirmReport.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/approved`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              report_id: this.reportDetail.report_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            this.onGetReportDetail()
            this.confirmReport.loading = false
            this.confirmReport.dialog = false
          })
          .catch(() => {
            this.confirmReport.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message:
                'ไม่พบข้อมูลรายงานนี้ อาจมีผู้ใช้งานท่านอื่นลบรายการตรวจแล้ว',
            })
          })
      }
    },

    async getImageBase64(imagePath) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        try {
          const response = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/image-64`,
            {
              image_path: imagePath,
              page_focus: 'report',
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          return response.data.data
        } catch (error) {
          this.onNotify({
            notifyValue: true,
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            message: error.response,
          })
        }
      }
    },

    createPDF() {
      this.downloadPDFLoading = true
      const pdfPageDetail = [
        {
          page: 1,
          mainImage: this.projectFile.main,
          projectDetail: this.reportDetail.project_detail,
          typeDetail: this.reportDetail.type_detail,
          customerDetail: this.reportDetail.customer_detail,
          coordinatorDetail: this.reportDetail.coordinator_detail,
        },
      ]

      const planList = [
        this.projectFile.plan1,
        this.projectFile.plan2,
        this.projectFile.plan3,
        this.projectFile.plan4,
      ].filter(Boolean)

      planList.forEach((plan, index) => {
        const pageNumber = Math.floor(index / 2) + 2
        const planNumber = index + 1

        pdfPageDetail[pageNumber - 1] = pdfPageDetail[pageNumber - 1] || {
          page: pageNumber,
        }
        pdfPageDetail[pageNumber - 1][`plan${planNumber}`] = {
          plan: planNumber,
          image: plan,
        }
      })

      const noteDataGroup = this.noteGroupList

      const filterKeys = ['image_path', 'deflect_status', 'deflect_detail']
      const filterDeflectList = (list) =>
        list.map((deflect) =>
          Object.fromEntries(
            Object.entries(deflect).filter(([key]) => filterKeys.includes(key))
          )
        )

      const filteredLocationSetup = this.locationList.map((e) => ({
        locationName: e.location_name,
        deflectList: filterDeflectList(e.deflect_list),
      }))

      const filteredSystemSetup = this.systemList.map((e) => ({
        systemName: e.system_name,
        deflectList: filterDeflectList(e.deflect_list),
      }))

      filteredLocationSetup.forEach((location) => {
        location.deflectList.forEach(() => {
          this.createPDFModal.allLocationDeflect =
            this.createPDFModal.allLocationDeflect + 1
        })
      })

      filteredSystemSetup.forEach((system) => {
        system.deflectList.forEach(() => {
          this.createPDFModal.allSystemDeflect =
            this.createPDFModal.allSystemDeflect + 1
        })
      })

      this.downloadPDFLoading = false
      this.createPDFModal.dialog = true
      this.setupImage(
        pdfPageDetail,
        noteDataGroup,
        filteredLocationSetup,
        filteredSystemSetup
      )
    },

    async setupImage(
      pdfPageDetail,
      noteDataGroup,
      filteredLocationSetup,
      filteredSystemSetup
    ) {
      // Setup Main Image
      const mainImage = await this.getImageBase64(pdfPageDetail[0].mainImage)
      this.convertBase64To16by9(mainImage.image, (resultBase64) => {
        pdfPageDetail[0].mainImage = {
          image: resultBase64,
          width: mainImage.width,
          height: mainImage.height,
        }
      })

      // Setup Plan Image
      if (pdfPageDetail[1]) {
        if (pdfPageDetail[1].plan1) {
          const plan1Data = await this.getImageBase64(
            pdfPageDetail[1].plan1.image
          )
          pdfPageDetail[1].plan1.image = plan1Data.image
          pdfPageDetail[1].plan1.width = plan1Data.width
          pdfPageDetail[1].plan1.height = plan1Data.height
        }

        if (pdfPageDetail[1].plan2) {
          const plan2Data = await this.getImageBase64(
            pdfPageDetail[1].plan2.image
          )
          pdfPageDetail[1].plan2.image = plan2Data.image
          pdfPageDetail[1].plan2.width = plan2Data.width
          pdfPageDetail[1].plan2.height = plan2Data.height
        }
      }

      if (pdfPageDetail[2]) {
        if (pdfPageDetail[2].plan3) {
          const plan3Data = await this.getImageBase64(
            pdfPageDetail[2].plan3.image
          )
          pdfPageDetail[2].plan3.image = plan3Data.image
          pdfPageDetail[2].plan3.width = plan3Data.width
          pdfPageDetail[2].plan3.height = plan3Data.height
        }
        if (pdfPageDetail[2].plan4) {
          const plan4Data = await this.getImageBase64(
            pdfPageDetail[2].plan4.image
          )
          pdfPageDetail[2].plan4.image = plan4Data.image
          pdfPageDetail[2].plan4.width = plan4Data.width
          pdfPageDetail[2].plan4.height = plan4Data.height
        }
      }
      this.createPDFModal.setupPageDetail = true

      this.onCreateFilePDF(
        pdfPageDetail,
        noteDataGroup,
        filteredLocationSetup,
        filteredSystemSetup
      )
    },

    convertBase64To16by9(base64, callback) {
      const img = new Image()
      img.onload = function () {
        const aspectRatio = 16 / 9
        const imgWidth = img.width
        const imgHeight = img.height
        const imgAspectRatio = imgWidth / imgHeight

        let newWidth, newHeight, offsetX, offsetY
        if (imgAspectRatio > aspectRatio) {
          newWidth = imgHeight * aspectRatio
          newHeight = imgHeight
          offsetX = (imgWidth - newWidth) / 2
          offsetY = 0
        } else {
          newWidth = imgWidth
          newHeight = imgWidth / aspectRatio
          offsetX = 0
          offsetY = (imgHeight - newHeight) / 2
        }
        const canvas = document.createElement('canvas')
        canvas.width = 16 * 50
        canvas.height = 9 * 50
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          newWidth,
          newHeight,
          0,
          0,
          canvas.width,
          canvas.height
        )
        const resultBase64 = canvas.toDataURL('image/jpeg')
        callback(resultBase64)
      }
      img.src = base64
    },

    drawSection(pdfDoc, x, y, width, title) {
      pdfDoc.setLineWidth(0.5)
      pdfDoc.setDrawColor('#E8E8E8')
      pdfDoc.line(x, y, x + width, y)

      pdfDoc.setFontSize(14)
      pdfDoc.setTextColor('#265B7F')
      pdfDoc.setFont('Sarabun-SemiBold', 'normal')
      this.thaitext(pdfDoc, title, x, y + 8)

      pdfDoc.setLineWidth(0.5)
      pdfDoc.setDrawColor('#E8E8E8')
      pdfDoc.line(x, y + 11.5, x + width, y + 11.5)
    },

    drawSectionError(pdfDoc, x, y, width, title) {
      pdfDoc.setLineWidth(0.5)
      pdfDoc.setDrawColor('#E8E8E8')
      pdfDoc.line(x, y, x + width, y)

      pdfDoc.setFontSize(14)
      pdfDoc.setTextColor('#ED7665')
      pdfDoc.setFont('Sarabun-SemiBold', 'normal')
      this.thaitext(pdfDoc, title, x, y + 8)

      pdfDoc.setLineWidth(0.5)
      pdfDoc.setDrawColor('#E8E8E8')
      pdfDoc.line(x, y + 11.5, x + width, y + 11.5)
    },

    drawLabel(pdfDoc, x, y, title) {
      pdfDoc.setFontSize(12)
      pdfDoc.setTextColor('#676268')
      pdfDoc.setFont('Sarabun-SemiBold', 'normal')
      this.thaitext(pdfDoc, title, x, y)
    },

    drawValue(pdfDoc, x, y, title, maxWidth) {
      pdfDoc.setFontSize(12)
      pdfDoc.setTextColor('#676268')
      pdfDoc.setFont('Sarabun-Regular', 'normal')
      const textLines = pdfDoc.splitTextToSize(title, maxWidth)
      for (let i = 0; i < textLines.length; i++) {
        this.thaitext(pdfDoc, textLines[i], x, y + i * 5.5)
      }
    },

    drawNoteTitle(pdfDoc, x, y, title, maxWidth) {
      pdfDoc.setFontSize(12)
      pdfDoc.setTextColor('#171A1C')
      pdfDoc.setFont('Sarabun-SemiBold', 'normal')
      const textLines = pdfDoc.splitTextToSize(title, maxWidth)
      for (let i = 0; i < textLines.length; i++) {
        this.thaitext(pdfDoc, textLines[i], x, y + i * 6)
      }
    },

    drawValueList(pdfDoc, x, y, title, maxWidth) {
      pdfDoc.setFontSize(10)
      pdfDoc.setTextColor('#676268')
      pdfDoc.setFont('Sarabun-Regular', 'normal')
      const textLines = pdfDoc.splitTextToSize(title, maxWidth)
      for (let i = 0; i < textLines.length; i++) {
        this.thaitext(pdfDoc, textLines[i], x, y + i * 6)
      }
    },

    drawValueListItem(pdfDoc, x, y, text) {
      pdfDoc.setFontSize(10)
      pdfDoc.setTextColor('#676268')
      pdfDoc.setFont('Sarabun-Regular', 'normal')
      pdfDoc.text('-', x + 5, y + 16)
      this.drawValueList(pdfDoc, x + 10, y + 16, text, 77.5)
    },

    drawNoteBox(pdfDoc, x, y, title, item) {
      pdfDoc.setDrawColor('#D3CFCF')
      const noteBox = {
        x,
        y,
        width: 180,
        height: 25,
      }
      this.drawNoteTitle(
        pdfDoc,
        noteBox.x + 5,
        noteBox.y + 8,
        title,
        noteBox.width - 10
      )

      if (item[0]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y,
          item[0].listMessage
        )
      }
      if (item[1]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y,
          item[1].listMessage
        )
      }

      if (item[2]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 12,
          item[2].listMessage
        )
        noteBox.height = noteBox.height + 12
      }
      if (item[3]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 12,
          item[3].listMessage
        )
      }

      if (item[4]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 24,
          item[4].listMessage
        )
        noteBox.height = noteBox.height + 12
      }
      if (item[5]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 24,
          item[5].listMessage
        )
      }

      if (item[6]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 36,
          item[6].listMessage
        )
        noteBox.height = noteBox.height + 12
      }
      if (item[7]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 36,
          item[7].listMessage
        )
      }

      if (item[8]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x,
          noteBox.y + 48,
          item[8].listMessage
        )
        noteBox.height = noteBox.height + 12
      }
      if (item[9]) {
        this.drawValueListItem(
          pdfDoc,
          noteBox.x + 87.5,
          noteBox.y + 48,
          item[9].listMessage
        )
      }

      pdfDoc.rect(noteBox.x, noteBox.y, noteBox.width, noteBox.height)
    },

    drawFooterNote(pdfDoc) {
      pdfDoc.setFontSize(8.5)
      pdfDoc.setTextColor('#ED7665')
      pdfDoc.setFont('Sarabun-Regular', 'normal')
      this.thaitext(pdfDoc, 'หมายเหตุ:', 15, 290)
      pdfDoc.setTextColor('#747677')
      this.thaitext(
        pdfDoc,
        'การตรวจสอบทั้งหมดขึ้นอยู่กับสภาพปัจจุบันของหน้างานในวันที่ตรวจสอบ และขึ้นอยู่กับ specification ของโครงการที่ทำการตรวจสอบ',
        30,
        290
      )
    },

    thaitext(pdfDoc, str, x, y) {
      const sara = ['่', '้', '๊', '๋', '์']
      const pushers = ['ิ', 'ี', 'ึ', 'ื', 'ำ', 'ั']
      let base = ''
      const dim = pdfDoc.getTextDimensions(str)
      for (let i = 0; i < str.length; i++) {
        const c = str.charAt(i)
        if (!sara.includes(c)) {
          base += c
        } else {
          const pusher = base.charAt(base.length - 1)
          if (!pushers.includes(pusher)) {
            if (str.charAt(i + 1) !== '' && str.charAt(i + 1) === 'ำ') {
              const len = pdfDoc.getTextWidth(base + 'ำ')
              pdfDoc.text(c, x + len - 1.5, y - dim.h / 3)
            } else {
              base += c
            }
          } else {
            const len = pdfDoc.getTextWidth(base)
            pdfDoc.text(c, x + len, y - dim.h / 3)
          }
        }
      }
      pdfDoc.text(base, x, y)
    },

    setImageCenter(maxHeight, imageWidth, imageHeight) {
      const targetHeight = maxHeight
      const aspectRatio = imageWidth / imageHeight
      const targetWidth = targetHeight * aspectRatio
      const pageWidth = 210
      const xPosition = (pageWidth - targetWidth) / 2
      return [xPosition, targetWidth]
    },

    deflectBox(pdfDoc, image, status, detail, x, y) {
      pdfDoc.setDrawColor('#D3CFCF')
      pdfDoc.rect(x, y, 88, 80)
      if (image) {
        pdfDoc.addImage(image, 'JPEG', x + 4, y + 4, 80, 50)
      } else {
        pdfDoc.rect(x + 4, y + 4, 80, 50)
      }
      const intStatus = parseInt(status, 10)
      if (intStatus === 1) {
        const statusPassActive = require('@/assets/images/pass-active.jpg')
        pdfDoc.addImage(statusPassActive, 'JPG', x + 4, y + 57, 37.5, 8)
        const statusNotPass = require('@/assets/images/not-pass.jpg')
        pdfDoc.addImage(statusNotPass, 'JPG', x + 46.5, y + 57, 37.5, 8)
      } else if (intStatus === 0) {
        const statusPass = require('@/assets/images/pass.jpg')
        pdfDoc.addImage(statusPass, 'JPG', x + 4, y + 57, 37.5, 8)
        const statusNotPassActive = require('@/assets/images/not-pass-active.jpg')
        pdfDoc.addImage(statusNotPassActive, 'JPG', x + 46.5, y + 57, 37.5, 8)
      }
      this.drawValue(pdfDoc, x + 4, y + 71, detail, 80)
    },

    async onCreateFilePDF(
      pdfPageDetail,
      noteDataGroup,
      updatedLocationSetup,
      updatedSystemSetup
    ) {
      // eslint-disable-next-line new-cap
      const pdfDoc = new jsPDF()

      const imageHeader = require('@/assets/images/header-page-2.png')
      pdfDoc.addImage(imageHeader, 'PNG', 15, 10, 180, 43.55)

      // ---> Main Image
      if (pdfPageDetail[0].mainImage) {
        const mainImage = pdfPageDetail[0].mainImage
        pdfDoc.addImage(mainImage.image, 'JPEG', 15, 55, 180, 101.25)
      } else {
        pdfDoc.setFillColor('#F2F2F2')
        pdfDoc.rect(15, 55, 180, 94, 'F')
      }

      const projectDetail = pdfPageDetail[0].projectDetail
      this.drawSection(pdfDoc, 15, 162, 80, 'ข้อมูล โปรเจค')
      this.drawLabel(pdfDoc, 15, 184, 'ชื่อโปรเจค')
      this.drawValue(pdfDoc, 42, 184, projectDetail.project_name, 53)
      this.drawLabel(pdfDoc, 15, 196, 'ตรวจรอบที่')
      this.drawValue(pdfDoc, 42, 196, projectDetail.inspection_no, 53)
      this.drawLabel(pdfDoc, 15, 208, 'วันที่เข้าตรวจ')
      this.drawValue(pdfDoc, 42, 208, this.formatDatePDF(projectDetail.working_date), 53)

      const customerDetail = pdfPageDetail[0].customerDetail
      this.drawSection(pdfDoc, 105, 162, 90, 'ข้อมูล ลูกค้า')
      this.drawLabel(pdfDoc, 105, 184, 'ชื่อ')
      this.drawValue(pdfDoc, 125, 184, customerDetail.name, 70)
      this.drawLabel(pdfDoc, 105, 196, 'เบอร์โทร')
      this.drawValue(pdfDoc, 125, 196, customerDetail.phone ? this.formatPhoneNumber(customerDetail.phone) : '-', 70)
      this.drawLabel(pdfDoc, 105, 208, 'อีเมล')
      if (customerDetail.email) {
        const customerEmailList = customerDetail.email.split(',')
        if (customerEmailList[0]) {
          this.drawValue(pdfDoc, 125, 208, customerEmailList[0], 70)
        }
        if (customerEmailList[1]) {
          this.drawValue(pdfDoc, 125, 214, customerEmailList[1], 70)
        }
        if (customerEmailList[2]) {
          this.drawValue(pdfDoc, 125, 220, customerEmailList[2], 70)
        }
      } else {
        this.drawValue(pdfDoc, 125, 208, '-', 70)
      }

      const typeDetail = pdfPageDetail[0].typeDetail
      this.drawSection(pdfDoc, 15, 224, 80, 'ข้อมูล ' + typeDetail.project_type)
      this.drawLabel(pdfDoc, 15, 246, 'ประเภท')
      this.drawValue(pdfDoc, 42, 246, typeDetail.project_type, 53)
      this.drawLabel(pdfDoc, 15, 258, 'เลขที่')
      this.drawValue(pdfDoc, 42, 258, typeDetail.type_address || '-', 53)
      this.drawLabel(pdfDoc, 15, 270, 'พื้นที่ใช้สอย')
      this.drawValue(pdfDoc, 42, 270, `${typeDetail.type_usable_area} ตร.ม.`, 53)

      const coordinatorDetail = pdfPageDetail[0].coordinatorDetail
      this.drawSection(pdfDoc, 105, 224, 90, 'ข้อมูล เจ้าหน้าที่โครงการ')
      this.drawLabel(pdfDoc, 105, 246, 'ชื่อ')
      this.drawValue(pdfDoc, 125, 246, coordinatorDetail.name || '-', 70)
      this.drawLabel(pdfDoc, 105, 258, 'เบอร์โทร')
      this.drawValue(pdfDoc, 125, 258, coordinatorDetail.phone ? this.formatPhoneNumber(coordinatorDetail.phone) : '-', 70 )
      this.drawLabel(pdfDoc, 105, 270, 'อีเมล')
      if (coordinatorDetail.email) {
        const coordinatorEmailList = coordinatorDetail.email.split(',')
        if (coordinatorEmailList[0]) {
          this.drawValue(pdfDoc, 125, 270, coordinatorEmailList[0], 70)
        }
        if (coordinatorEmailList[1]) {
          this.drawValue(pdfDoc, 125, 276, coordinatorEmailList[1], 70)
        }
        if (coordinatorEmailList[2]) {
          this.drawValue(pdfDoc, 125, 282, coordinatorEmailList[2], 70)
        }
      } else {
        this.drawValue(pdfDoc, 125, 270, '-', 70)
      }

      // ---> Plan 1 Page
      const planPage1 = pdfPageDetail[1]
      if (planPage1) {
        pdfDoc.addPage()
        this.drawSection(pdfDoc, 15, 10, 180, 'แปลน')

        if (planPage1.plan1) {
          const target = this.setImageCenter(
            120,
            planPage1.plan1.width,
            planPage1.plan1.height
          )
          this.setImageCenter()
          pdfDoc.addImage(
            planPage1.plan1.image,
            'JPEG',
            target[0],
            32,
            target[1],
            120
          )
        }

        if (planPage1.plan2) {
          const target = this.setImageCenter(
            120,
            planPage1.plan2.width,
            planPage1.plan2.height
          )
          this.setImageCenter()
          pdfDoc.addImage(
            planPage1.plan2.image,
            'JPEG',
            target[0],
            160,
            target[1],
            120
          )
        }
      }

      // ---> Plan 2 Page
      const planPage2 = pdfPageDetail[2]
      if (planPage2) {
        pdfDoc.addPage()
        this.drawSection(pdfDoc, 15, 10, 180, 'แปลน')

        if (planPage2.plan3) {
          const target = this.setImageCenter(
            120,
            planPage2.plan3.width,
            planPage2.plan3.height
          )
          this.setImageCenter()
          pdfDoc.addImage(
            planPage2.plan3.image,
            'JPEG',
            target[0],
            32,
            target[1],
            120
          )
        }

        if (planPage2.plan4) {
          const target = this.setImageCenter(
            120,
            planPage2.plan4.width,
            planPage2.plan4.height
          )
          this.setImageCenter()
          pdfDoc.addImage(
            planPage2.plan4.image,
            'JPEG',
            target[0],
            160,
            target[1],
            120
          )
        }
      }

      // ---> Note Page
      const getNextNumber = (line) => {
        if (line === 0) {
          return 32
        } else if (line === 1) {
          return 10
        } else if (line === 2) {
          return 16
        } else if (line === 3) {
          return 22
        } else {
          return false
        }
      }

      const setupNote = []
      noteDataGroup.forEach((element) => {
        setupNote.push({
          line: pdfDoc.splitTextToSize(element.note_title, 180).length,
          type: "title",
          text: element.note_title,
          start: 0,
          next: 10
        })
        if (element.note_message) {
          const messageList = element.note_message.split('<br />\n')
          pdfDoc.setFontSize(10)
          pdfDoc.setFont('Sarabun-Regular', 'normal')
          messageList.forEach((msg) => {
            msg = msg.replace(/\s+/g, ' ');
            const getListNumber = pdfDoc.splitTextToSize(msg, 180).length
            setupNote.push({
              line: getListNumber,
              type: "message",
              text: msg,
              start: 0,
              next: getNextNumber(getListNumber)
            })
          })
        }
      })

      const groupedData = this.groupDataByTitle(setupNote);

      const calculateTotalLines = (group) => {
        return group.reduce((total, item) => total + item.line, 0);
      };

      const fillterLine = groupedData.map((group) => ({
        line: calculateTotalLines(group),
        noteGroup: group,
      }));

      const allNotePage = [];
      let onePage = [];
      let countLine = 0;

      for (const item of fillterLine) {
        if (countLine + item.line < 25) {
          onePage.push(item);
          countLine += item.line;
        } else {
          allNotePage.push([...onePage]);
          onePage = [item];
          countLine = item.line;
        }
      }

      if (onePage.length > 0) {
        allNotePage.push(onePage);
      }

      const mapDataNote = allNotePage.map(item => item.map(subItem => subItem.noteGroup));
      const flatMapDataNote = mapDataNote.map(innerArray => [innerArray.flat()]);

      flatMapDataNote.forEach(item => {
        item[0].unshift({
          line: 0,
          type: "header",
          next: 32,
          start: 0,
          text: "หมายเหตุ",
        })
      });

      flatMapDataNote.forEach(item => {
        for (let index = 1; index < item[0].length; index++) {
          if (item[0][index].type === "title" && index === 1) {
            item[0][index].start = item[0][index - 1].next
            item[0][index].next = item[0][index].next + item[0][index - 1].next
          } else if (item[0][index].type === "title" && index !== 1) {
            item[0][index].start = item[0][index - 1].next + 6
            item[0][index].next = item[0][index].next + item[0][index - 1].next + 6
          } else if (item[0][index].type === "message") {
            item[0][index].start = item[0][index - 1].next
            item[0][index].next = item[0][index].next + item[0][index - 1].next
          }
        }
      });

      flatMapDataNote.forEach(item => {
        pdfDoc.addPage()
        this.drawSectionError(pdfDoc, 15, 10, 180, 'หมายเหตุ')
        this.drawFooterNote(pdfDoc)
        for (let index = 1; index < item[0].length; index++) {
          if (item[0][index].type === "title") {
            this.drawNoteTitle(pdfDoc, 15, item[0][index].start, item[0][index].text, 180)
          } else if (item[0][index].type === "message") {
            this.drawValueList(pdfDoc, 15, item[0][index].start, item[0][index].text, 180)
          }
        }
      });

      // ---> Location Page
      const topLeft = [15, 28]
      const topRight = [107, 28]
      const centerLeft = [15, 112]
      const centerRight = [107, 112]
      const bottomLeft = [15, 196]
      const bottomRight = [107, 196]

      const newMockupLocation = []

      updatedLocationSetup.forEach((location) => {
        const deflectList = location.deflectList
        let pageCount = 0
        let boxCount = 1
        for (let i = 0; i < deflectList.length; i++) {
          if (i % 6 === 0) {
            newMockupLocation.push({
              newPage: true,
              locationName: location.locationName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: 'top-left',
            })
            // eslint-disable-next-line no-unused-vars
            pageCount++
            // eslint-disable-next-line no-unused-vars
            boxCount++
          } else {
            let positionSetup = ''
            if (boxCount === 2) {
              positionSetup = 'top-right'
            } else if (boxCount === 3) {
              positionSetup = 'center-left'
            } else if (boxCount === 4) {
              positionSetup = 'center-right'
            } else if (boxCount === 5) {
              positionSetup = 'bottom-left'
            } else if (boxCount === 6) {
              positionSetup = 'bottom-right'
            }
            newMockupLocation.push({
              newPage: false,
              locationName: location.locationName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: positionSetup,
            })
            // eslint-disable-next-line no-unused-vars
            boxCount++
            if (boxCount === 7) boxCount = 1
          }
        }
      })

      for (let i = 0; i < newMockupLocation.length; i++) {
        const box = newMockupLocation[i]
        const imageData = await this.getImageBase64(box.image_path)
        box.image_path = imageData.image
        this.createPDFModal.setupPageLocation =
          this.createPDFModal.setupPageLocation + 1
        if (box.newPage) {
          pdfDoc.addPage()
          this.drawSection(pdfDoc, 15, 10, 180, 'Location: ' + box.locationName)
          this.drawFooterNote(pdfDoc)
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            topLeft[0],
            topLeft[1]
          )
        } else if (box.position === 'top-right') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            topRight[0],
            topRight[1]
          )
        } else if (box.position === 'center-left') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            centerLeft[0],
            centerLeft[1]
          )
        } else if (box.position === 'center-right') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            centerRight[0],
            centerRight[1]
          )
        } else if (box.position === 'bottom-left') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            bottomLeft[0],
            bottomLeft[1]
          )
        } else if (box.position === 'bottom-right') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            bottomRight[0],
            bottomRight[1]
          )
        }
      }

      // ---> System Page
      const newMockupSystem = []

      updatedSystemSetup.forEach((system) => {
        const deflectList = system.deflectList
        let pageCount = 0
        let boxCount = 1
        for (let i = 0; i < deflectList.length; i++) {
          if (i % 6 === 0) {
            newMockupSystem.push({
              newPage: true,
              systemName: system.systemName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: 'top-left',
            })
            // eslint-disable-next-line no-unused-vars
            pageCount++
            // eslint-disable-next-line no-unused-vars
            boxCount++
          } else {
            let positionSetup = ''
            if (boxCount === 2) {
              positionSetup = 'top-right'
            } else if (boxCount === 3) {
              positionSetup = 'center-left'
            } else if (boxCount === 4) {
              positionSetup = 'center-right'
            } else if (boxCount === 5) {
              positionSetup = 'bottom-left'
            } else if (boxCount === 6) {
              positionSetup = 'bottom-right'
            }
            newMockupSystem.push({
              newPage: false,
              systemName: system.systemName,
              deflect_detail: deflectList[i].deflect_detail,
              deflect_status: deflectList[i].deflect_status,
              image_path: deflectList[i].image_path,
              position: positionSetup,
            })
            // eslint-disable-next-line no-unused-vars
            boxCount++
            if (boxCount === 7) boxCount = 1
          }
        }
      })

      for (let i = 0; i < newMockupSystem.length; i++) {
        const box = newMockupSystem[i]
        const imageData = await this.getImageBase64(box.image_path)
        box.image_path = imageData.image
        this.createPDFModal.setupPageSystem =
          this.createPDFModal.setupPageSystem + 1
        if (box.newPage) {
          pdfDoc.addPage()
          this.drawSection(pdfDoc, 15, 10, 180, 'System: ' + box.systemName)
          this.drawFooterNote(pdfDoc)
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            topLeft[0],
            topLeft[1]
          )
        } else if (box.position === 'top-right') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            topRight[0],
            topRight[1]
          )
        } else if (box.position === 'center-left') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            centerLeft[0],
            centerLeft[1]
          )
        } else if (box.position === 'center-right') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            centerRight[0],
            centerRight[1]
          )
        } else if (box.position === 'bottom-left') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            bottomLeft[0],
            bottomLeft[1]
          )
        } else if (box.position === 'bottom-right') {
          this.deflectBox(
            pdfDoc,
            box.image_path,
            box.deflect_status,
            box.deflect_detail || '-',
            bottomRight[0],
            bottomRight[1]
          )
        }
      }

      const fileName =
        this.reportDetail.project_detail.project_name.replace(/\s/g, '-') +
        '-รายการตรวจที่-' +
        this.reportDetail.project_detail.inspection_no

      setTimeout(() => {
        this.createPDFModal.dialog = false
        pdfDoc.save(`${fileName}.pdf`)
      }, 1500)
    },

    groupDataByTitle(data) {
      const result = [];
      let currentGroup = [];
      for (const item of data) {
        if (item.type === 'title') {
          if (currentGroup.length > 0) {
            result.push(currentGroup);
          }
          currentGroup = [item];
        } else {
          currentGroup.push(item);
        }
      }
      if (currentGroup.length > 0) {
        result.push(currentGroup);
      }
      return result;
    },

    previewNoteGroupList(noteGroup) {
      const setupNote = []
      noteGroup.forEach((element) => {
        setupNote.push({
          type: "title",
          text: element.note_title,
        })
        if (element.note_message) {
          const messageList = element.note_message.split('<br />\n')
          messageList.forEach((msg) => {
            msg = msg.replace(/\s+/g, ' ');
            setupNote.push({
              type: "message",
              text: msg
            })
          })
        }
      })

      this.noteGroupPreview = this.groupDataByTitle(setupNote);
    }
  },
}
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.page-a4 {
  padding: 80px;
}

.page-box {
  margin-left: 24px;
}

.page-header {
  font-size: 60px;
  font-weight: 700;
}

.page-subtitle {
  font-size: 28px;
  color: #676268;
  padding-bottom: 16px;
}

.page-contact {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #676268;
  font-size: 30px;
  font-weight: 700;
  padding: 16px 0;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}

.cp-flex {
  display: flex;
  gap: 100px;
  margin: 50px 0;
}

.cp-col {
  flex: 1;
}

.cp-col-7 {
  flex: 7;
}

.cp-col-5 {
  flex: 5;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--base-primary);
  padding: 12px 0;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  padding: 8px 0;
}

.detail-label .detail-key {
  min-width: 100px;
  color: #676268;
  font-weight: 600;
}

.detail-label .detail-value {
  color: #676268;
}

.detail-plan {
  border: 1px solid #d9d9d9;
  padding: 30px;
  margin: 50px 0;
}

.cp-icon-delete {
  transition: all ease 0.3s;
}

.cp-icon-delete:hover {
  color: var(--base-error);
}

/* Added */
.footer-action {
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  border-top: 1px solid var(--gray-100);
  transition: all ease 0.3s;
}

/* Deflect */
.deflect-container {
  margin-bottom: 60px;
}

.deflect-card-no {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  padding: 24px;
  color: var(--gray-400);
  font-size: 18px;
  font-weight: 600;
  border: 1px solid var(--gray-100);
  background-color: var(--gray-opacity-1);
}

.deflect-card {
  padding: 24px;
  border: 1px solid var(--gray-100);
}

.box-status {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.box-status .status {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--gray-opacity-1);
  cursor: pointer;
  transition: all ease 0.3s;
}

.box-status .status-pass:hover {
  background-color: var(--green-100);
}

.box-status .status-pass-active {
  cursor: default;
  background-color: var(--green-100);
}

.box-status .status-not-pass:hover {
  background-color: var(--red-100);
}

.box-status .status-not-pass-active {
  cursor: default;
  background-color: var(--red-100);
}

.box-status-only {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.box-status-only .status {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--gray-opacity-1);
}

.box-status-only .status-pass {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--green-100);
}

.box-status-only .status-not-pass {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--red-100);
}

.box-status-wait {
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: var(--orange-opacity-1);
  border: 1px solid var(--orange-500);
  color: var(--orange-600);
  margin-bottom: 16px;
}

.box-status-wait .wait-icon {
  color: var(--orange-600);
}

.no-deflect {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  height: 200px;
  border: 1px solid var(--gray-300);
  background-color: var(--gray-opacity-1);
}
</style>
