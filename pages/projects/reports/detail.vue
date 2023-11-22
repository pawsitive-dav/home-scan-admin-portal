<template>
  <div v-if="reportDetail">
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span class="mr-1" @click="$router.push('/projects/reports')">
        <cp-link> รายงานทั้งหมด </cp-link>
      </span>
      /
      <span class="mx-1 cp-text-disable">
        {{ reportDetail.project_detail.project_name }}
      </span>
    </div>

    <v-row v-if="reportDetail" class="mt-2">
      <v-col cols="12">
        <div class="d-flex align-center cp-header-2 cp-bold mb-4">
          <div>
            รายงานของ รายการตรวจที่
            {{ reportDetail.project_detail.inspection_no }}
          </div>
          <div class="ml-4">
            <v-btn
              v-if="reportDetail.report_status == 'in-progress'"
              :loading="approvalReport.checkLoading"
              color="primary"
              elevation="0"
              @click="onBeforeApprovalReport()"
            >
              <v-icon left>mdi-file-sign</v-icon>
              ขอการยืนยันรางงาน
            </v-btn>
            <div v-else-if="reportDetail.report_status == 'approval'">
              <div class="d-flex align-center">
                <v-chip label color="info" class="mr-4">รอการยืนยัน</v-chip>
                <v-avatar size="40" color="primary">
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
                  <div class="cp-semibold cp-body">ผู้ยืนยัน</div>
                  <div class="cp-caption cp-text-description truncate">
                    ({{ reportDetail.checker_supervisor.code_name }})
                    {{
                      reportDetail.checker_supervisor.first_name +
                      ' ' +
                      reportDetail.checker_supervisor.last_name
                    }}
                  </div>
                </div>
                <v-btn
                  v-if="role == 'Admin' || role == 'Project Manager'"
                  outlined
                  elevation="0"
                  color="primary"
                  class="ml-4"
                  @click="cancelApproval.dialog = true"
                >
                  <v-icon left>mdi-file-document-refresh-outline</v-icon>
                  ยกเลิกการยืนยัน
                </v-btn>
              </div>
            </div>
            <div v-else-if="reportDetail.report_status == 'approved'">
              <div class="d-flex align-center">
                <v-chip label color="success" class="mr-4">
                  รายงานได้รับการยืนยัน
                </v-chip>
                <v-avatar size="40" color="primary">
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
                    <v-icon small>mdi-calendar-clock-outline</v-icon>
                    {{ formatDate(reportDetail.approved_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-spacer />
          <div>
            <v-btn
              v-if="
                (reportDetail.report_status == 'in-progress' &&
                  role == 'Admin') ||
                (reportDetail.report_status == 'in-progress' &&
                  role == 'Project Manager')
              "
              color="error"
              elevation="0"
              @click="deleteReport.dialog = true"
            >
              <v-icon left>mdi-trash-can-outline</v-icon>
              ลบรายงาน
            </v-btn>
            <v-btn
              v-if="
                reportDetail.report_status == 'approval' &&
                accountId == reportDetail.checker_supervisor.account_id
              "
              color="success"
              elevation="0"
              @click="confirmReport.dialog = true"
            >
              <v-icon left>mdi-file-document-check-outline</v-icon>
              ยืนยันรายงาน
            </v-btn>
            <v-btn
              v-if="reportDetail.report_status == 'approved'"
              color="primary"
              outlined
              large
              @click="createPDF()"
            >
              <v-icon class="mr-2">mdi-file-download-outline</v-icon>
              รายงาน (PDF)
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Page Header -->
    <cp-card class="page-a4">
      <v-img :src="require('@/assets/images/header-page.png')" width="100%" />

      <div class="my-6">
        <v-img
          v-if="projectFile.main"
          :src="projectFile.main"
          width="100%"
          height="600px"
          style="border-radius: 12px"
        />
        <v-card v-else flat color="grey lighten-4" width="100%" height="600px">
        </v-card>
      </div>

      <!-- Project Detail -->
      <div class="cp-flex">
        <div class="cp-col-7">
          <div class="detail-title">ข้อมูล โปรเจค</div>
          <div class="detail-label">
            <div class="detail-key">ชื่อโปรเจค</div>
            <div class="detail-value">
              {{ reportDetail.project_detail.project_name }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">ตรวจรอบที่</div>
            <div class="detail-value">
              {{ reportDetail.project_detail.inspection_no }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">วันที่เข้าตรวจ</div>
            <div class="detail-value">
              {{ formatDate(reportDetail.project_detail.working_date) }}
            </div>
          </div>
        </div>
        <div class="cp-col-5">
          <div class="detail-title">ข้อมูล ลูกค้า</div>
          <div class="detail-label">
            <div class="detail-key">ชื่อ</div>
            <div class="detail-value">
              {{ reportDetail.customer_detail.name }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">เบอร์โทร</div>
            <div class="detail-value">
              {{
                reportDetail.customer_detail.phone
                  ? formatPhoneNumber(reportDetail.customer_detail.phone)
                  : '-'
              }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">อีเมล</div>
            <div class="detail-value">
              {{ reportDetail.customer_detail.email || '-' }}
            </div>
          </div>
        </div>
      </div>

      <div class="cp-flex">
        <div class="cp-col-7">
          <div class="detail-title">
            ข้อมูล {{ reportDetail.type_detail.project_type }}
          </div>
          <div class="detail-label">
            <div class="detail-key">ประเภท</div>
            <div class="detail-value">
              {{ reportDetail.type_detail.project_type }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">เลขที่</div>
            <div class="detail-value">
              {{ reportDetail.type_detail.type_address || '-' }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">พื้นที่ใช้สอย</div>
            <div class="detail-value">
              <span v-if="reportDetail.type_detail.type_usable_area">
                {{ reportDetail.type_detail.type_usable_area }} ตร.ม.
              </span>
              <span v-else>-</span>
            </div>
          </div>
        </div>
        <div class="cp-col-5">
          <div class="detail-title">ข้อมูล เจ้าหน้าที่โครงการ</div>
          <div class="detail-label">
            <div class="detail-key">ชื่อ</div>
            <div class="detail-value">
              {{ reportDetail.coordinator_detail.name }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">เบอร์โทร</div>
            <div class="detail-value">
              {{
                reportDetail.coordinator_detail.phone
                  ? formatPhoneNumber(reportDetail.coordinator_detail.phone)
                  : '-'
              }}
            </div>
          </div>
          <div class="detail-label">
            <div class="detail-key">อีเมล</div>
            <div class="detail-value">
              {{ reportDetail.coordinator_detail.email || '-' }}
            </div>
          </div>
        </div>
      </div>
    </cp-card>

    <!-- Page Plan -->
    <cp-card class="page-a4 mt-6">
      <div class="detail-title">แปลน</div>
      <div class="detail-plan">
        <div v-if="!projectFile.plan1" class="text-center pt-6">
          <div class="cp-title cp-text-description">ไม่มีข้อมูลแปลน</div>
        </div>
        <v-row v-else>
          <v-col cols="6">
            <v-img
              :src="projectFile.plan1"
              width="100%"
              contain
              style="border-radius: 12px"
            />
          </v-col>
          <v-col cols="6">
            <v-img
              :src="projectFile.plan2"
              width="100%"
              contain
              style="border-radius: 12px"
            />
          </v-col>
          <v-col cols="6">
            <v-img
              :src="projectFile.plan3"
              width="100%"
              contain
              style="border-radius: 12px"
            />
          </v-col>
          <v-col cols="6">
            <v-img
              :src="projectFile.plan4"
              width="100%"
              contain
              style="border-radius: 12px"
            />
          </v-col>
        </v-row>
      </div>
    </cp-card>

    <!-- Page Note -->
    <cp-card class="page-a4 mt-6">
      <div class="detail-title mb-6">
        <span class="error--text">หมายเหตุ</span>
      </div>

      <div
        v-for="(list, index) in noteGroupList"
        :key="index + 'noteGroup'"
        class="added-report-note"
      >
        <div v-if="!list.edit">
          <div class="note-title">{{ list.report_title }}</div>
          <div
            v-if="list.report_description"
            class="note-description cp-text-description"
          >
            {{ list.report_description }}
          </div>
          <v-row no-gutters>
            <v-col
              v-for="(item, i) in list.note_list"
              :key="i + 'note_list'"
              :cols="list.note_list.length > 1 ? '6' : '12'"
            >
              <div class="note-item-list">
                <ul>
                  <li>{{ item.list_message }}</li>
                </ul>
              </div>
            </v-col>
          </v-row>
          <div
            v-if="reportDetail.report_status == 'in-progress'"
            class="footer-action"
          >
            <v-btn icon @click="onEditNote(list)">
              <v-icon>mdi-text-box-edit-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              class="cp-icon-delete"
              @click="
                ;(deleteNoteGroup.dialog = true), (deleteNoteGroup.data = list)
              "
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Edit Note -->
        <div v-else>
          <v-form
            ref="formEditNote"
            v-model="list.editNote.valid"
            lazy-validation
          >
            <div>
              <v-text-field
                v-model="list.editNote.title"
                :rules="[(v) => !!v || 'ข้อมูลจำเป็น']"
                :disabled="list.editNote.loading"
                placeholder="หัวข้อหมายเหตุ"
                maxlength="100"
                counter="100"
                outlined
              />
            </div>
            <div>
              <v-textarea
                v-model="list.editNote.description"
                :disabled="list.editNote.loading"
                placeholder="รายละเอียด (ถ้ามี)"
                maxlength="250"
                counter="250"
                outlined
                auto-grow
              />
            </div>
            <v-row>
              <v-col
                v-for="(listEdit, indexEdit) in list.editNote.noteList"
                :key="indexEdit + 'editNote'"
                :cols="list.editNote.noteList.length > 1 ? '6' : '12'"
              >
                <v-text-field
                  v-model="listEdit.noteListValue"
                  :rules="[(v) => !!v || 'ข้อมูลจำเป็น']"
                  :disabled="list.editNote.loading"
                  append-icon="mdi-close"
                  placeholder="รายการเพิ่มเติม"
                  maxlength="120"
                  counter="120"
                  outlined
                  @click:append="deleteNoteListEdit(list, indexEdit)"
                />
              </v-col>
              <v-col cols="12">
                <div v-if="list.editNote.noteList.length != 10">
                  <div
                    v-if="!list.editNote.loading"
                    class="add-note-list"
                    @click="addNoteEdit(list)"
                  >
                    <div>
                      <v-icon class="add-icon">mdi-plus</v-icon>
                      <span>เพิ่มรายการ</span>
                    </div>
                  </div>
                  <div v-else class="add-note-list-disable">
                    <div>
                      <v-icon class="add-icon">mdi-plus</v-icon>
                      <span>เพิ่มรายการ</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <div class="d-flex pt-6">
              <v-spacer />
              <v-btn
                :disabled="list.editNote.loading"
                elevation="0"
                @click="cancelEditNoteGroup(list)"
              >
                ยกเลิก
              </v-btn>
              <v-btn
                :loading="list.editNote.loading"
                :disabled="!list.editNote.valid"
                color="primary"
                elevation="0"
                class="ml-4"
                @click="onUpdateNoteGroup(list)"
              >
                บันทึกการแก้ไข
              </v-btn>
            </div>
          </v-form>
        </div>
      </div>

      <div class="my-4 text-center">
        <v-icon color="grey">mdi-dots-horizontal</v-icon>
      </div>

      <!-- Add Note -->
      <div
        v-if="reportDetail.report_status == 'in-progress'"
        class="add-report-note"
      >
        <div class="cp-title cp-text-primary pb-4 error--text">
          เพิ่มหมายเหตุใหม่
        </div>
        <v-form ref="formAddNote" v-model="addNote.valid" lazy-validation>
          <div>
            <v-text-field
              v-model="addNote.title"
              :rules="[(v) => !!v || 'ข้อมูลจำเป็น']"
              :disabled="addNote.loading"
              placeholder="หัวข้อหมายเหตุ"
              maxlength="100"
              counter="100"
              outlined
            />
          </div>
          <div>
            <v-textarea
              v-model="addNote.description"
              :disabled="addNote.loading"
              placeholder="รายละเอียด (ถ้ามี)"
              maxlength="250"
              counter="250"
              outlined
              auto-grow
            />
          </div>
          <v-row>
            <v-col
              v-for="(list, index) in addNote.noteList"
              :key="index + 'noteList'"
              :cols="addNote.noteList.length > 1 ? '6' : '12'"
            >
              <v-text-field
                v-model="list.noteListValue"
                :rules="[(v) => !!v || 'ข้อมูลจำเป็น']"
                :disabled="addNote.loading"
                append-icon="mdi-close"
                placeholder="รายการเพิ่มเติม"
                maxlength="120"
                counter="120"
                outlined
                @click:append="deleteNoteList(index)"
              />
            </v-col>
            <v-col cols="12">
              <div v-if="addNote.noteList.length != 10">
                <div
                  v-if="!addNote.loading"
                  class="add-note-list"
                  @click="addNoteList()"
                >
                  <div>
                    <v-icon class="add-icon">mdi-plus</v-icon>
                    <span>เพิ่มรายการ</span>
                  </div>
                </div>
                <div v-else class="add-note-list-disable">
                  <div>
                    <v-icon class="add-icon">mdi-plus</v-icon>
                    <span>เพิ่มรายการ</span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <div class="d-flex pt-6">
            <v-spacer />
            <v-btn
              :loading="addNote.loading"
              :disabled="!addNote.valid"
              color="primary"
              elevation="0"
              @click="saveNoteList()"
            >
              บันทึก
            </v-btn>
          </div>
        </v-form>
      </div>
    </cp-card>

    <!-- Page Location -->
    <cp-card class="page-a4 mt-6">
      <div v-if="locationList.length == 0" class="no-deflect">
        Location ยังไม่มี Deflect
      </div>
      <div v-for="(list, index) in locationList" :key="index + 'locationList'">
        <div class="detail-title mb-6">
          <span class="cp-text-primary">
            Location: {{ list.location_name }}
          </span>
        </div>
        <div class="deflect-container">
          <v-row>
            <v-col
              v-for="(deflectItem, indexDeflect) in list.deflect_list"
              :key="indexDeflect + 'List'"
              cols="6"
            >
              <div v-if="!deflectItem.image_path" class="deflect-card-no">
                ไม่มี Deflect
              </div>
              <div v-else class="deflect-card">
                <v-img
                  :src="deflectItem.image_path"
                  aspect-ratio="1.6"
                  class="grey lighten-2"
                  style="border-radius: 12px; margin-bottom: 16px"
                >
                </v-img>
                <div
                  v-if="reportDetail.report_status == 'in-progress'"
                  class="box-status"
                >
                  <div
                    :class="
                      deflectItem.deflect_status == 1
                        ? 'status-pass-active'
                        : ''
                    "
                    class="status status-pass"
                    @click="
                      onUpdateDeflectStatus(
                        deflectItem.image_id,
                        list.location_id,
                        1,
                        deflectItem.deflect_status
                      )
                    "
                  >
                    <v-icon
                      v-if="deflectItem.deflect_status == 1"
                      color="success"
                      class="status-icon"
                      large
                    >
                      mdi-checkbox-outline
                    </v-icon>
                    <v-icon v-else large class="status-icon">
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <span
                      v-if="deflectItem.deflect_status == 1"
                      class="success--text"
                    >
                      ผ่าน
                    </span>
                    <span v-else>ผ่าน</span>
                  </div>
                  <div
                    :class="
                      deflectItem.deflect_status == 0
                        ? 'status-not-pass-active'
                        : ''
                    "
                    class="status status-not-pass"
                    @click="
                      onUpdateDeflectStatus(
                        deflectItem.image_id,
                        list.location_id,
                        0,
                        deflectItem.deflect_status
                      )
                    "
                  >
                    <v-icon
                      v-if="deflectItem.deflect_status == 0"
                      color="error"
                      class="status-icon"
                      large
                    >
                      mdi-close-box-outline
                    </v-icon>
                    <v-icon v-else large class="status-icon">
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <span
                      v-if="deflectItem.deflect_status == 0"
                      class="error--text"
                    >
                      ไม่ผ่าน
                    </span>
                    <span v-else>ไม่ผ่าน</span>
                  </div>
                </div>
                <div v-else>
                  <div
                    v-if="deflectItem.deflect_status == 1"
                    class="box-status-only"
                  >
                    <div class="status-pass">
                      <v-icon color="success" large>
                        mdi-checkbox-outline
                      </v-icon>
                      <span class="success--text"> ผ่าน </span>
                    </div>
                    <div class="status">
                      <v-icon large color="grey">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <span class="grey--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                  <div
                    v-if="deflectItem.deflect_status == 0"
                    class="box-status-only"
                  >
                    <div class="status">
                      <v-icon color="grey" large>
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <span class="grey--text"> ผ่าน </span>
                    </div>
                    <div class="status-not-pass">
                      <v-icon large color="error">
                        mdi-close-box-outline
                      </v-icon>
                      <span class="error--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                </div>

                <v-row no-gutters>
                  <v-col cols="3">
                    <div class="cp-semibold">รายละเอียด:</div>
                  </v-col>
                  <v-col cols="9">
                    {{ deflectItem.deflect_detail || '-' }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div>
                  <cp-label>ลงข้อมูลโดย</cp-label>
                  <div class="d-flex align-center">
                    <v-avatar size="40" color="primary">
                      <img
                        v-if="deflectItem.created_by.avatar_path"
                        :src="deflectItem.created_by.avatar_path"
                      />
                      <v-img
                        v-else
                        :src="require('@/assets/images/no-avatar.png')"
                      />
                    </v-avatar>
                    <div class="ml-4">
                      <div class="cp-semibold">
                        ({{ deflectItem.created_by.code_name }})
                        {{
                          deflectItem.created_by.first_name +
                          ' ' +
                          deflectItem.created_by.last_name
                        }}
                      </div>
                      <div>
                        <v-icon small>mdi-calendar-clock-outline</v-icon>
                        <span class="cp-text-description">{{
                          formatDate(deflectItem.created_at)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </cp-card>

    <!-- Page System -->
    <cp-card class="page-a4 mt-6">
      <div v-if="systemList.length == 0" class="no-deflect">
        System ยังไม่มี Deflect
      </div>
      <div v-for="(list, index) in systemList" :key="index + 'systemList'">
        <div class="detail-title mb-6">
          <span class="cp-text-primary"> System: {{ list.system_name }} </span>
        </div>
        <div class="deflect-container">
          <v-row>
            <v-col
              v-for="(deflectItem, indexDeflect) in list.deflect_list"
              :key="indexDeflect + 'List'"
              cols="6"
            >
              <div v-if="!deflectItem.image_path" class="deflect-card-no">
                ไม่มี Deflect
              </div>
              <div v-else class="deflect-card">
                <v-img
                  :src="deflectItem.image_path"
                  aspect-ratio="1.6"
                  class="grey lighten-2"
                  style="border-radius: 12px; margin-bottom: 16px"
                >
                </v-img>
                <div
                  v-if="deflectItem.deflect_status == null"
                  class="box-status-wait"
                >
                  <v-icon class="wait-icon">mdi-home-search-outline</v-icon>
                  รอทีมตรวจบันทึกสถานะ
                </div>
                <div v-else>
                  <div
                    v-if="deflectItem.deflect_status == 1"
                    class="box-status-only"
                  >
                    <div class="status-pass">
                      <v-icon color="success" large>
                        mdi-checkbox-outline
                      </v-icon>
                      <span class="success--text"> ผ่าน </span>
                    </div>
                    <div class="status">
                      <v-icon large color="grey">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <span class="grey--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                  <div
                    v-if="deflectItem.deflect_status == 0"
                    class="box-status-only"
                  >
                    <div class="status">
                      <v-icon color="grey" large>
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <span class="grey--text"> ผ่าน </span>
                    </div>
                    <div class="status-not-pass">
                      <v-icon large color="error">
                        mdi-close-box-outline
                      </v-icon>
                      <span class="error--text"> ไม่ผ่าน </span>
                    </div>
                  </div>
                </div>

                <v-row no-gutters>
                  <v-col cols="3">
                    <div class="cp-semibold">รายละเอียด:</div>
                  </v-col>
                  <v-col cols="9">
                    {{ deflectItem.deflect_detail || '-' }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div>
                  <cp-label>ลงข้อมูลโดย</cp-label>
                  <div class="d-flex align-center">
                    <v-avatar size="40" color="primary">
                      <img
                        v-if="deflectItem.created_by.avatar_path"
                        :src="deflectItem.created_by.avatar_path"
                      />
                      <v-img
                        v-else
                        :src="require('@/assets/images/no-avatar.png')"
                      />
                    </v-avatar>
                    <div class="ml-4">
                      <div class="cp-semibold">
                        ({{ deflectItem.created_by.code_name }})
                        {{
                          deflectItem.created_by.first_name +
                          ' ' +
                          deflectItem.created_by.last_name
                        }}
                      </div>
                      <div>
                        <v-icon small>mdi-calendar-clock-outline</v-icon>
                        <span class="cp-text-description">{{
                          formatDate(deflectItem.created_at)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </cp-card>

    <!-- Delete Team Checker -->
    <v-dialog
      v-model="deleteNoteGroup.dialog"
      :persistent="deleteNoteGroup.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบหมายเหตุ
          <v-spacer />
          <v-btn
            :disabled="deleteNoteGroup.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteNoteGroup.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบรายการนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteNoteGroup.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteNoteGroup()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Report -->
    <v-dialog
      v-model="deleteReport.dialog"
      :persistent="deleteReport.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบรางงานนี้
          <v-spacer />
          <v-btn
            :disabled="deleteReport.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteReport.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบรายงานนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteReport.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteReport()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

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
          ขอการยืนยันรางงาน
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
              การขอยืนยันจะทำให้ไม่สามารถแก้ไขข้อมูลรายงานนี้ได้
            </div>
            <cp-label>หัวหน้าทีมตรวจของโปรเจค</cp-label>
            <v-card outlined class="pa-2">
              <div class="d-flex align-center">
                <v-avatar size="55" color="primary">
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
              <div class="cp-text-capitalize">ดำเนินการ</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Report Approval -->
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
          ยกเลิกยืนยันรางงาน
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
          การยกเลิกการยืนยันจะทำให้สามารถแก้ไขข้อมูลรายงานได้
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="cancelApproval.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onCancelReportApproval()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
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
          ยืนยันรางงาน
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
          การยืนยันรายงานนี้จะทำให้สถานะของโปรเจคเสร็จสิ้นและไม่สามารถแก้ไขข้อมูลได้อีก
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="confirmReport.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onConfirmReportApproved()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
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
      addNote: {
        loading: false,
        valid: false,
        title: '',
        description: '',
        noteList: [],
      },
      deleteNoteGroup: {
        loading: false,
        dialog: false,
        data: null,
      },
      locationListStatus: false,
      locationList: [],
      systemListStatus: false,
      systemList: [],
      deleteReport: {
        loading: false,
        dialog: false,
        data: null,
      },
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
    }
  },

  head: {
    title: 'Report Detail',
  },

  computed: {
    ...mapState('user', [
      'accountId',
      'avatarPath',
      'firstName',
      'lastName',
      'codeName',
      'role',
      'appRoleList',
    ]),
  },

  watch: {
    reportDetail(newValue) {
      if (newValue) {
        this.onGetReportNoteList()
        this.onGetLocationList()
        this.onGetSystemList()
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
      const result = moment(dateStr)
        .locale('th')
        .format('DD/MMMM/yyyy เวลา HH:mm')
      return result
    },

    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
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

    async onGetReportNoteList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/note-list`,
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
              data.data.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
              )

              this.noteGroupList = data.data.map((item) => {
                item.edit = false
                item.editNote = {
                  loading: false,
                  valid: true,
                  title: item.report_title,
                  description: item.report_description,
                  noteList: item.note_list.map((note) => ({
                    noteListValue: note.list_message,
                  })),
                }
                return item
              })
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

    async onDeleteNoteGroup() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteNoteGroup.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/delete`,
            {
              report_id: this.$route.query.id,
              report_note_id: this.deleteNoteGroup.data.report_note_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.onGetReportNoteList()
              this.deleteNoteGroup.loading = false
              this.deleteNoteGroup.dialog = false
            }
          })
          .catch(({ response }) => {
            this.deleteNoteGroup.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data.data,
            })
          })
      }
    },

    addNoteList() {
      const item = {
        noteListValue: '',
      }
      this.addNote.noteList.push(item)
    },

    deleteNoteList(index) {
      this.addNote.noteList.splice(index, 1)
    },

    async saveNoteList() {
      if (this.$refs.formAddNote.validate()) {
        this.addNote.loading = true
        const setData = {
          title: this.addNote.title.trim(),
          description: this.addNote.description.trim(),
          noteList: [],
        }
        for (let i = 0; i < this.addNote.noteList.length; i++) {
          setData.noteList.push(this.addNote.noteList[i].noteListValue.trim())
        }

        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/add`,
              {
                project_id: this.reportDetail.project_id,
                inspection_id: this.reportDetail.inspection_id,
                report_id: this.$route.query.id,
                report_title: setData.title,
                report_description: setData.description,
                note_list: setData.noteList,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              if (data.data) {
                this.onGetReportNoteList()
                this.addNote.title = ''
                this.addNote.description = ''
                this.addNote.noteList = []
                this.$refs.formAddNote.resetValidation()
                this.addNote.loading = false
              }
            })
            .catch(({ response }) => {
              this.addNote.loading = false
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: response.data.data,
              })
            })
        }
      }
    },

    onEditNote(data) {
      const hasUnfinishedEdits = this.noteGroupList.some(
        (element) => element.edit
      )
      if (hasUnfinishedEdits) {
        this.onNotify({
          notifyValue: true,
          type: 'warning',
          title: 'แจ้งเตือน',
          message: 'มีรายการที่ยังแก้ไขไม่แล้วเสร็จ',
        })
      } else {
        data.edit = true
      }
    },

    cancelEditNoteGroup(data) {
      data.editNote.title = data.report_title
      data.editNote.description = data.report_description
      data.editNote.noteList = data.note_list.map((note) => ({
        noteListValue: note.list_message,
      }))
      data.edit = false
    },

    addNoteEdit(data) {
      const item = {
        noteListValue: '',
      }
      data.editNote.noteList.push(item)
    },

    deleteNoteListEdit(data, index) {
      data.editNote.noteList.splice(index, 1)
    },

    async onUpdateNoteGroup(data) {
      if (this.$refs.formEditNote[0].validate()) {
        data.editNote.loading = true
        const setData = {
          title: data.editNote.title.trim(),
          description: data.editNote.description.trim(),
          noteList: [],
        }

        const noteListPromises = data.editNote.noteList.map(async (item) => {
          return await item.noteListValue.trim()
        })

        const noteListValues = await Promise.all(noteListPromises)

        setData.noteList = noteListValues

        const accessToken = await this.getAccessToken()
        if (accessToken) {
          try {
            const { data: responseData } = await this.$axios.post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/report/note/edit`,
              {
                project_id: this.reportDetail.project_id,
                inspection_id: this.reportDetail.inspection_id,
                report_id: this.$route.query.id,
                report_note_id: data.report_note_id,
                report_title: setData.title,
                report_description: setData.description,
                note_list: setData.noteList,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            if (responseData.data) {
              data.editNote.loading = false
              this.onGetReportNoteList()
            }
          } catch ({ response }) {
            data.editNote.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response,
            })
            throw response
          }
        }
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
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].deflect_list.sort((a, b) => a.id - b.id)
              }
              this.locationList = data.data
              this.locationListStatus = true
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

    async onUpdateDeflectStatus(imageId, loactionId, status, statusNow) {
      const accessToken = await this.getAccessToken()
      if (accessToken && status !== statusNow) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/location/deflect/status`,
            {
              project_id: this.reportDetail.project_id,
              inspection_id: this.reportDetail.inspection_id,
              location_id: loactionId,
              image_id: imageId,
              deflect_status: status,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'การดำเนินสำเร็จ',
              message: 'สถานะของ Deflect ถูกเปลี่ยนแล้ว',
            })
            this.onGetLocationList()
          })
          .catch((error) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'ดำเนินการไม่สำเร็จ',
              message: error,
            })
          })
      }
    },

    async onDeleteReport() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/delete`,
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
          .then(({ data }) => {
            this.$router.push('/projects/reports')
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response,
            })
          })
      }
    },

    async onBeforeApprovalReport() {
      this.approvalReport.checkLoading = true
      await this.onGetLocationList()
      await this.onGetSystemList()

      const intervalId = setInterval(() => {
        if (this.locationListStatus && this.systemListStatus) {
          this.approvalReport.checkLoading = false
          this.onBeforeApprovalReportChecking()
          clearInterval(intervalId)
        }
      }, 1000)
    },

    onBeforeApprovalReportChecking() {
      const checkDeflectStatus = (list) => {
        return list.every((location) => {
          return location.deflect_list.every(
            (deflect) => deflect.deflect_status !== null
          )
        })
      }

      const isLocationStatusOK = checkDeflectStatus(this.locationList)
      const isSystemStatusOK = checkDeflectStatus(this.systemList)

      if (!isLocationStatusOK || !isSystemStatusOK) {
        this.onNotify({
          notifyValue: true,
          type: 'warning',
          title: 'แจ้งเตือน',
          message: 'มีรายการ Deflect ที่ยังไม่มีสถานะ กรุณาตรวจสอบข้อมูล',
        })
      } else if (
        this.locationList.length === 0 ||
        this.systemList.length === 0
      ) {
        this.onNotify({
          notifyValue: true,
          type: 'warning',
          title: 'แจ้งเตือน',
          message: 'ไม่มีรายการ Deflect กรุณาตรวจสอบข้อมูล',
        })
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
          .then(({ data }) => {
            this.onGetReportDetail()
            this.approvalReport.loading = false
            this.approvalReport.dialog = false
          })
          .catch(({ response }) => {
            this.approvalReport.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response,
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
          .then(({ data }) => {
            this.onGetReportDetail()
            this.cancelApproval.loading = false
            this.cancelApproval.dialog = false
          })
          .catch(({ response }) => {
            this.cancelApproval.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response,
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
          .then(({ data }) => {
            this.onGetReportDetail()
            this.confirmReport.loading = false
            this.confirmReport.dialog = false
          })
          .catch(({ response }) => {
            this.confirmReport.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response,
            })
          })
      }
    },

    createPDF() {
      // eslint-disable-next-line new-cap
      const pdfDoc = new jsPDF()

      const imageHeader = require('@/assets/images/header-page.png')
      pdfDoc.addImage(imageHeader, 'PNG', 10, 10, 180, 43.55)

      pdfDoc.save('pdf-test.pdf')
    },
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
  color: #676268;
  font-weight: 600;
}
.detail-label .detail-value {
  color: #676268;
}
.detail-plan {
  border-radius: 12px;
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
.added-report-note {
  position: relative;
  width: 100%;
  border-radius: 12px;
  border: 2px solid #ececec;
  padding: 24px;
  margin: 16px 0;
  cursor: default;
  transition: all ease 0.3s;
}
.added-report-note:hover {
  border: 2px solid var(--base-primary);
}
.added-report-note:hover .footer-action {
  padding-top: 16px;
  opacity: 1;
}
.footer-action {
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  border-top: 1px solid var(--gray-100);
  transition: all ease 0.3s;
}
.added-report-note .note-title {
  font-size: 20px;
  font-weight: 600;
  color: #171a1c;
  word-wrap: break-word;
}
.added-report-note .note-description {
  padding: 8px 0;
  word-wrap: break-word;
}
.added-report-note .note-item-list {
  width: 100%;
  margin: 8px 0;
  word-wrap: break-word;
}
.added-report-note .note-item-list ul li {
  padding-left: 8px;
  margin-left: 8px;
}

/* Add */
.add-report-note {
  width: 100%;
  border-radius: 12px;
  border: 2px dashed #ececec;
  padding: 24px;
  margin: 16px 0;
  transition: all ease 0.3s;
}
.add-report-note:hover {
  border: 2px dashed var(--base-primary);
}
.add-note-list-disable {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  cursor: default;
  color: var(--gray-300);
  border: 1px dashed var(--base-border);
}
.add-note-list-disable .add-icon {
  color: var(--gray-300);
}
.add-note-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--gray-300);
  border: 1px dashed var(--base-border);
  transition: all ease 0.3s;
}
.add-note-list .add-icon {
  color: var(--gray-300);
}
.add-note-list:hover {
  background-color: var(--gray-opacity-1);
  color: var(--base-primary);
}
.add-note-list:hover .add-icon {
  color: var(--base-primary);
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
  border-radius: 12px;
  color: var(--gray-400);
  font-size: 18px;
  font-weight: 600;
  border: 1px solid var(--gray-100);
  background-color: var(--gray-opacity-1);
}
.deflect-card {
  padding: 24px;
  border-radius: 12px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 12px;
  border: 1px solid var(--gray-300);
  background-color: var(--gray-opacity-1);
}
</style>
