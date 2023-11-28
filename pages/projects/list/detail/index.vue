<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span class="mr-1" @click="$router.push('/projects/list')">
        <cp-link> รายการโปรเจค </cp-link>
      </span>
      /
      <span v-if="!projectDetail" class="mx-1 cp-text-disable">...</span>
      <span v-else class="mx-1 cp-text-disable">
        {{ projectDetail ? projectDetail.project_name : '' }}
      </span>
    </div>

    <v-row v-if="!projectDetail" class="mt-2">
      <v-col cols="12">
        <div class="d-flex">
          <v-sheet color="grey lighten-2" width="300" height="30" />
          <v-sheet
            color="grey lighten-2"
            width="100"
            height="30"
            class="ml-4"
          />
        </div>
        <v-sheet color="grey lighten-2" width="500" height="20" class="mt-6" />
      </v-col>
    </v-row>
    <v-row v-if="projectDetail" class="mt-2">
      <v-col cols="12">
        <div class="d-flex align-center cp-header-2 cp-bold mb-2">
          <div v-if="role != 'Checker'">
            <div
              v-if="editProjectName.oldData.length === 0"
              class="box-edit-project-name mr-2"
              @click="
                ;(editProjectName.oldData = projectDetail.project_name),
                  (editProjectName.newData = projectDetail.project_name),
                  (editProjectName.focus = true)
              "
            >
              {{ projectDetail.project_name }}
            </div>
            <v-sheet v-else width="500" class="mr-2">
              <v-text-field
                v-model="editProjectName.newData"
                :append-icon="
                  editProjectName.status ? 'mdi-content-save-outline' : ''
                "
                :autofocus="editProjectName.focus"
                :error="editProjectName.error"
                dense
                outlined
                hide-details
                @blur="
                  ;(editProjectName.oldData = ''),
                    (editProjectName.newData = ''),
                    (editProjectName.status = false),
                    (editProjectName.focus = false),
                    (editProjectName.error = false)
                "
                @click:append="saveNewProjectName()"
              />
            </v-sheet>
          </div>
          <div v-else class="mr-4">
            {{ projectDetail.project_name }}
          </div>

          <v-chip v-if="projectDetail.project_status == 'to-do'" label>
            เตรียมดำเนินการ
          </v-chip>
          <v-chip
            v-else-if="projectDetail.project_status == 'in-progress'"
            label
            color="warning"
          >
            กำลังดำเนินการ
          </v-chip>
          <v-chip
            v-else-if="projectDetail.project_status == 'report-approval'"
            label
            color="green lighten-3"
          >
            รอการตรวจสอบรายงาน
          </v-chip>
          <v-chip
            v-else-if="projectDetail.project_status == 'done'"
            label
            color="success"
          >
            โปรเจคเสร็จสิ้น
          </v-chip>
        </div>
        <div class="d-flex align-center">
          <b>ประเภท:</b>
          <span class="ml-1 primary--text cp-semibold cp-subtitle">
            {{ projectDetail.type_name }}
          </span>
          <b class="ml-4">วันที่สร้าง:</b>
          <span class="cp-text-description ml-1">
            {{ formatDateMax(projectDetail.created_at) }}
          </span>

          <b class="ml-4">สร้างโดย:</b>
          <span class="cp-text-description ml-1">
            ({{ projectDetail.created_by.code_name }})
            {{
              projectDetail.created_by.first_name +
              ' ' +
              projectDetail.created_by.last_name
            }}
          </span>
        </div>
      </v-col>

      <v-col cols="12" sm="8" md="8" lg="8">
        <v-row>
          <v-col cols="12">
            <cp-card class="pa-6">
              <v-row>
                <!-- หมายเหตุ: บอกทีมหน้างาน -->
                <v-col cols="12">
                  <div class="cp-text-description">หมายเหตุ: บอกทีมหน้างาน</div>
                  <div v-if="role != 'Checker'">
                    <div
                      v-if="!editProjectNote.focus"
                      class="box-edit"
                      @click="
                        ;(editProjectNote.oldData =
                          projectDetail.project_note || ''),
                          (editProjectNote.newData =
                            projectDetail.project_note || ''),
                          (editProjectNote.focus = true)
                      "
                    >
                      {{ projectDetail.project_note || '-' }}
                    </div>
                    <v-textarea
                      v-else
                      v-model="editProjectNote.newData"
                      :append-icon="
                        editProjectNote.status ? 'mdi-content-save-outline' : ''
                      "
                      :autofocus="editProjectNote.focus"
                      counter="250"
                      maxlength="250"
                      rows="3"
                      outlined
                      auto-grow
                      @blur="
                        ;(editProjectNote.oldData = ''),
                          (editProjectNote.newData = ''),
                          (editProjectNote.status = false),
                          (editProjectNote.focus = false)
                      "
                      @click:append="saveNewProjectNote()"
                    />
                  </div>
                  <div v-else class="box-no-edit">
                    {{ projectDetail.project_note || '-' }}
                  </div>
                </v-col>

                <!-- เลขที่ -->
                <v-col cols="12" md="4">
                  <div class="cp-text-description">เลขที่</div>
                  <div v-if="role != 'Checker'">
                    <div
                      v-if="!editTypeAddress.focus"
                      class="box-edit"
                      @click="
                        ;(editTypeAddress.oldData = projectDetail.type_address),
                          (editTypeAddress.newData =
                            projectDetail.type_address),
                          (editTypeAddress.focus = true)
                      "
                    >
                      {{ projectDetail.type_address || '-' }}
                    </div>
                    <v-form
                      v-else
                      ref="formEditTypeAddress"
                      v-model="editTypeAddress.valid"
                      lazy-validation
                    >
                      <v-text-field
                        v-model="editTypeAddress.newData"
                        :append-icon="
                          editTypeAddress.status
                            ? 'mdi-content-save-outline'
                            : ''
                        "
                        :autofocus="editTypeAddress.focus"
                        :rules="editTypeAddress.rules"
                        dense
                        outlined
                        @blur="
                          ;(editTypeAddress.oldData = ''),
                            (editTypeAddress.newData = ''),
                            (editTypeAddress.status = false),
                            (editTypeAddress.focus = false)
                        "
                        @click:append="saveNewTypeAddress()"
                      />
                    </v-form>
                  </div>
                  <div v-else class="box-no-edit">
                    {{ projectDetail.type_address || '-' }}
                  </div>
                </v-col>

                <!-- พื้นที่ใช้สอย -->
                <v-col cols="12" md="4">
                  <div class="cp-text-description">พื้นที่ใช้สอย</div>
                  <div v-if="role != 'Checker'">
                    <div
                      v-if="!editTypeUsableArea.focus"
                      class="box-edit"
                      @click="
                        ;(editTypeUsableArea.oldData =
                          projectDetail.type_usable_area || ''),
                          (editTypeUsableArea.newData =
                            projectDetail.type_usable_area || ''),
                          (editTypeUsableArea.focus = true)
                      "
                    >
                      {{ projectDetail.type_usable_area || '-' }}
                      <span v-if="projectDetail.type_usable_area" class="ml-2">
                        ตร.ม.
                      </span>
                    </div>
                    <v-form
                      v-else
                      ref="formEditTypeUsableArea"
                      v-model="editTypeUsableArea.valid"
                      lazy-validation
                    >
                      <v-text-field
                        v-model="editTypeUsableArea.newData"
                        :append-icon="
                          editTypeUsableArea.status
                            ? 'mdi-content-save-outline'
                            : ''
                        "
                        :autofocus="editTypeUsableArea.focus"
                        :rules="editTypeUsableArea.rules"
                        suffix="ตร.ม."
                        dense
                        outlined
                        @blur="
                          ;(editTypeUsableArea.oldData = ''),
                            (editTypeUsableArea.newData = ''),
                            (editTypeUsableArea.status = false),
                            (editTypeUsableArea.focus = false)
                        "
                        @click:append="saveNewTypeUsableArea()"
                      />
                    </v-form>
                  </div>
                  <div v-else class="box-no-edit">
                    {{ projectDetail.type_usable_area || '-' }}
                    <span v-if="projectDetail.type_usable_area" class="ml-2">
                      ตร.ม.
                    </span>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <!-- ข้อมูลลูกค้า -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">ข้อมูลลูกค้า</div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col cols="12" md="4">
                      <div class="cp-text-description">ชื่อ</div>
                      <div v-if="role != 'Checker'">
                        <div
                          v-if="!editCustomerName.focus"
                          class="box-edit"
                          @click="
                            ;(editCustomerName.oldData =
                              projectDetail.customer.customer_name),
                              (editCustomerName.newData =
                                projectDetail.customer.customer_name),
                              (editCustomerName.focus = true)
                          "
                        >
                          {{ projectDetail.customer.customer_name }}
                        </div>
                        <v-form
                          v-else
                          ref="formEditCustomerName"
                          v-model="editCustomerName.valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="editCustomerName.newData"
                            :append-icon="
                              editCustomerName.status
                                ? 'mdi-content-save-outline'
                                : ''
                            "
                            :autofocus="editCustomerName.focus"
                            :rules="editCustomerName.rules"
                            dense
                            outlined
                            @blur="
                              ;(editCustomerName.oldData = ''),
                                (editCustomerName.newData = ''),
                                (editCustomerName.status = false),
                                (editCustomerName.focus = false)
                            "
                            @click:append="saveNewCustomerName()"
                          />
                        </v-form>
                      </div>
                      <div v-else class="box-no-edit">
                        {{ projectDetail.customer.customer_name }}
                      </div>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col cols="12" md="3">
                      <div class="cp-text-description">เบอร์โทรศัพท์</div>
                      <div v-if="role != 'Checker'">
                        <div
                          v-if="!editCustomerPhone.focus"
                          class="box-edit"
                          @click="
                            ;(editCustomerPhone.oldData =
                              projectDetail.customer.customer_phone || ''),
                              (editCustomerPhone.newData =
                                projectDetail.customer.customer_phone || ''),
                              (editCustomerPhone.focus = true)
                          "
                        >
                          {{
                            projectDetail.customer.customer_phone
                              ? formatPhoneNumber(
                                  projectDetail.customer.customer_phone
                                )
                              : '-'
                          }}
                        </div>
                        <v-form
                          v-else
                          ref="formEditCustomerPhone"
                          v-model="editCustomerPhone.valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="editCustomerPhone.newData"
                            :append-icon="
                              editCustomerPhone.status
                                ? 'mdi-content-save-outline'
                                : ''
                            "
                            :autofocus="editCustomerPhone.focus"
                            :rules="editCustomerPhone.rules"
                            maxlength="10"
                            counter="10"
                            dense
                            outlined
                            @blur="
                              ;(editCustomerPhone.oldData = ''),
                                (editCustomerPhone.newData = ''),
                                (editCustomerPhone.status = false),
                                (editCustomerPhone.focus = false)
                            "
                            @click:append="saveNewCustomerPhone()"
                          />
                        </v-form>
                      </div>
                      <div v-else class="box-no-edit">
                        {{
                          projectDetail.customer.customer_phone
                            ? formatPhoneNumber(
                                projectDetail.customer.customer_phone
                              )
                            : '-'
                        }}
                      </div>
                    </v-col>

                    <!-- อีเมล -->
                    <v-col cols="12" md="5">
                      <div class="cp-text-description">อีเมล</div>
                      <div v-if="role != 'Checker'">
                        <div
                          v-if="!editCustomerEmail.focus"
                          class="box-edit"
                          @click="
                            ;(editCustomerEmail.oldData =
                              projectDetail.customer.customer_email || ''),
                              (editCustomerEmail.newData =
                                projectDetail.customer.customer_email || ''),
                              (editCustomerEmail.focus = true)
                          "
                        >
                          {{ projectDetail.customer.customer_email || '-' }}
                        </div>
                        <v-form
                          v-else
                          ref="formEditCustomerEmail"
                          v-model="editCustomerEmail.valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="editCustomerEmail.newData"
                            :append-icon="
                              editCustomerEmail.status
                                ? 'mdi-content-save-outline'
                                : ''
                            "
                            :autofocus="editCustomerEmail.focus"
                            :rules="editCustomerEmail.rules"
                            dense
                            outlined
                            @blur="
                              ;(editCustomerEmail.oldData = ''),
                                (editCustomerEmail.newData = ''),
                                (editCustomerEmail.status = false),
                                (editCustomerEmail.focus = false)
                            "
                            @click:append="saveNewCustomerEmail()"
                          />
                        </v-form>
                      </div>
                      <div v-else class="box-no-edit">
                        {{ projectDetail.customer.customer_email || '-' }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- ข้อมูลเจ้าหน้าที่โครงการ -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">ข้อมูลเจ้าหน้าที่โครงการ</div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col cols="12" md="4">
                      <div class="cp-text-description">ชื่อ</div>
                      <div v-if="role != 'Checker'">
                        <div
                          v-if="!editCoordinatorName.focus"
                          class="box-edit"
                          @click="
                            ;(editCoordinatorName.oldData =
                              projectDetail.coordinator.coordinator_name || ''),
                              (editCoordinatorName.newData =
                                projectDetail.coordinator.coordinator_name ||
                                ''),
                              (editCoordinatorName.focus = true)
                          "
                        >
                          {{
                            projectDetail.coordinator.coordinator_name || '-'
                          }}
                        </div>
                        <v-form
                          v-else
                          ref="formEditCoordinatorName"
                          v-model="editCoordinatorName.valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="editCoordinatorName.newData"
                            :append-icon="
                              editCoordinatorName.status
                                ? 'mdi-content-save-outline'
                                : ''
                            "
                            :autofocus="editCoordinatorName.focus"
                            :rules="editCoordinatorName.rules"
                            dense
                            outlined
                            @blur="
                              ;(editCoordinatorName.oldData = ''),
                                (editCoordinatorName.newData = ''),
                                (editCoordinatorName.status = false),
                                (editCoordinatorName.focus = false)
                            "
                            @click:append="saveNewCoordinatorName()"
                          />
                        </v-form>
                      </div>
                      <div v-else class="box-no-edit">
                        {{ projectDetail.coordinator.coordinator_name || '-' }}
                      </div>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col cols="12" md="3">
                      <div class="cp-text-description">เบอร์โทรศัพท์</div>
                      <div v-if="role != 'Checker'">
                        <div
                          v-if="!editCoordinatorPhone.focus"
                          class="box-edit"
                          @click="
                            ;(editCoordinatorPhone.oldData =
                              projectDetail.coordinator.coordinator_phone ||
                              ''),
                              (editCoordinatorPhone.newData =
                                projectDetail.coordinator.coordinator_phone ||
                                ''),
                              (editCoordinatorPhone.focus = true)
                          "
                        >
                          {{
                            projectDetail.coordinator.coordinator_phone
                              ? formatPhoneNumber(
                                  projectDetail.coordinator.coordinator_phone
                                )
                              : '-'
                          }}
                        </div>
                        <v-form
                          v-else
                          ref="formEditCoordinatorPhone"
                          v-model="editCoordinatorPhone.valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="editCoordinatorPhone.newData"
                            :append-icon="
                              editCoordinatorPhone.status
                                ? 'mdi-content-save-outline'
                                : ''
                            "
                            :autofocus="editCoordinatorPhone.focus"
                            :rules="editCoordinatorPhone.rules"
                            maxlength="10"
                            counter="10"
                            dense
                            outlined
                            @blur="
                              ;(editCoordinatorPhone.oldData = ''),
                                (editCoordinatorPhone.newData = ''),
                                (editCoordinatorPhone.status = false),
                                (editCoordinatorPhone.focus = false)
                            "
                            @click:append="saveNewCoordinatorPhone()"
                          />
                        </v-form>
                      </div>
                      <div v-else class="box-no-edit">
                        {{
                          projectDetail.coordinator.coordinator_phone
                            ? formatPhoneNumber(
                                projectDetail.coordinator.coordinator_phone
                              )
                            : '-'
                        }}
                      </div>
                    </v-col>

                    <!-- อีเมล -->
                    <v-col cols="12" md="5">
                      <div class="cp-text-description">อีเมล</div>
                      <div v-if="role != 'Checker'">
                        <div
                          v-if="!editCoordinatorEmail.focus"
                          class="box-edit"
                          @click="
                            ;(editCoordinatorEmail.oldData =
                              projectDetail.coordinator.coordinator_email ||
                              ''),
                              (editCoordinatorEmail.newData =
                                projectDetail.coordinator.coordinator_email ||
                                ''),
                              (editCoordinatorEmail.focus = true)
                          "
                        >
                          {{
                            projectDetail.coordinator.coordinator_email || '-'
                          }}
                        </div>
                        <v-form
                          v-else
                          ref="formEditCoordinatorEmail"
                          v-model="editCoordinatorEmail.valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="editCoordinatorEmail.newData"
                            :append-icon="
                              editCoordinatorEmail.status
                                ? 'mdi-content-save-outline'
                                : ''
                            "
                            :autofocus="editCoordinatorEmail.focus"
                            :rules="editCoordinatorEmail.rules"
                            dense
                            outlined
                            @blur="
                              ;(editCoordinatorEmail.oldData = ''),
                                (editCoordinatorEmail.newData = ''),
                                (editCoordinatorEmail.status = false),
                                (editCoordinatorEmail.focus = false)
                            "
                            @click:append="saveNewCoordinatorEmail()"
                          />
                        </v-form>
                      </div>
                      <div v-else class="box-no-edit">
                        {{ projectDetail.coordinator.coordinator_email || '-' }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </cp-card>
          </v-col>

          <v-col cols="12">
            <!-- รายการตรวจ -->
            <cp-card class="pa-6">
              <div class="d-flex pb-4">
                <div class="cp-subtitle pb-4">รายการตรวจ</div>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="role != 'Checker'"
                  :disabled="
                    projectDetail.project_status == 'in-progress' ||
                    projectDetail.project_status == 'report-approval' ||
                    (projectDetail.project_status == 'to-do' &&
                      projectTeams.supervisor.length === 0 &&
                      projectInspection.inspectionList.length > 0)
                  "
                  color="primary"
                  elevation="0"
                  @click="projectInspection.dialog = true"
                >
                  <v-icon left>mdi-list-box-outline</v-icon>
                  สร้างรายการตรวจสอบ
                </v-btn>
              </div>

              <div
                v-if="projectInspection.inspectionList.length == 0"
                class="cp-inspection-no-data"
              >
                <div class="text-center">
                  <div>
                    <v-icon color="grey" large>mdi-playlist-remove</v-icon>
                  </div>
                  <div>ยังไม่มีรายการตรวจสอบ</div>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="(list, index) in projectInspection.inspectionList"
                  :key="index + 'inspectionList'"
                  class="cp-inspection-card"
                >
                  <div class="cp-inspection-card-no">
                    <cp-link-to-detail
                      @click="
                        $router.push(
                          `detail/inspection?id=${list.inspection_id}`
                        )
                      "
                    >
                      <b>รายการตรวจที่ {{ list.inspection_no }}</b>
                    </cp-link-to-detail>
                    <div>
                      <v-chip
                        v-if="list.report_status == 'approval'"
                        color="info"
                        class="mt-1"
                        small
                        label
                      >
                        รายงานรอการยืนยัน
                      </v-chip>
                      <v-chip
                        v-if="list.report_status == 'approved'"
                        color="success"
                        class="mt-1"
                        small
                        label
                      >
                        รายงานได้รับการยืนยัน
                      </v-chip>
                    </div>
                  </div>
                  <v-divider vertical />
                  <div class="cp-inspection-card-detail">
                    <div>
                      <span class="cp-text-description">วันที่เข้าตรวจ:</span>
                      <b>{{ formatDate(list.working_date) }}</b>
                    </div>
                    <div>
                      <span class="cp-text-description">สร้างโดย:</span>
                      <b class="success--text">
                        ({{ JSON.parse(list.created_by).code_name }})
                        {{
                          JSON.parse(list.created_by).first_name +
                          ' ' +
                          JSON.parse(list.created_by).last_name
                        }}</b
                      >
                    </div>
                  </div>
                  <div class="cp-inspection-card-action">
                    <v-menu :close-on-content-click="false" bottom left>
                      <template #activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense nav>
                        <v-list-item
                          @click="
                            $router.push(
                              `detail/inspection?id=${list.inspection_id}`
                            )
                          "
                        >
                          ดูรายละเอียด
                        </v-list-item>
                        <div v-if="role != 'Checker'">
                          <v-list-item
                            v-if="!list.report_id"
                            :disabled="projectDetail.project_status == 'to-do'"
                            @click="onCreateReport(list)"
                          >
                            สร้างรายงาน
                          </v-list-item>
                          <v-list-item
                            v-else
                            @click="
                              $router.push(
                                `/projects/reports/detail?id=${list.report_id}`
                              )
                            "
                          >
                            ดูรายงาน
                          </v-list-item>
                        </div>
                        <div v-else>
                          <v-list-item
                            v-if="list.report_id"
                            @click="
                              $router.push(
                                `/projects/reports/detail?id=${list.report_id}`
                              )
                            "
                          >
                            ดูรายงาน
                          </v-list-item>
                        </div>
                        <div v-if="role != 'Checker'">
                          <div v-if="list.report_status != 'approved'">
                            <div
                              v-if="
                                projectInspection.inspectionList.length ==
                                list.inspection_no
                              "
                              class="delete-inspection"
                              @click="
                                ;(projectInspection.delete.dialog = true),
                                  (projectInspection.delete.inspectionId =
                                    list.inspection_id),
                                  (projectInspection.delete.reportStatus =
                                    list.report_status)
                              "
                            >
                              ลบรายการตรวจ
                            </div>
                          </div>
                        </div>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </div>
            </cp-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" sm="4" md="4" lg="4">
        <!-- ไฟล์ภาพของโปรเจค -->
        <cp-card-max class="pa-6">
          <div class="cp-subtitle pb-4">ไฟล์ภาพของโปรเจค</div>
          <v-row>
            <v-col cols="12">
              <input
                ref="imageInput"
                type="file"
                style="display: none"
                accept="image/*"
                @change="uploadImage"
              />
              <cp-label> รูปโปรเจค </cp-label>
              <div v-if="projectFile.mainPreview" class="image-zone">
                <v-img
                  :src="projectFile.mainPreview"
                  aspect-ratio="1.4"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.main"
                class="file-card-upload-main"
                @click="openImageInput(), (projectFile.uploadType = 'main')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.main.src"
                  aspect-ratio="1.4"
                  contain
                  @click=";(projectFile.dialog = true), (projectFile.show = 0)"
                >
                  <div class="cp-img">
                    <v-icon color="white" large> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.main" class="pt-2 d-flex justify-end">
                <v-btn
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    ;(projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.main)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.mainPreview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.mainLoading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.mainPreview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.mainLoading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('main')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 1 </cp-label>
              <div v-if="projectFile.plan1Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan1Preview"
                  aspect-ratio="1.4"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan1"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan1')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan1"
                  aspect-ratio="1.4"
                  contain
                  @click=";(projectFile.dialog = true), (projectFile.show = 1)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan1" class="pt-2 d-flex justify-end">
                <v-btn
                  v-if="!projectFile.plan2"
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    ;(projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan1)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan1Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan1Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan1Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan1Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan1')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 2 </cp-label>
              <div v-if="!projectFile.plan1" class="file-card-upload-disable">
                <div class="text-center">
                  <v-icon size="32" color="grey lighten-2">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 1 ก่อน</div>
                </div>
              </div>
              <div v-else-if="projectFile.plan2Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan2Preview"
                  aspect-ratio="1.4"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan2"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan2')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan2"
                  aspect-ratio="1.4"
                  contain
                  @click=";(projectFile.dialog = true), (projectFile.show = 2)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan2" class="pt-2 d-flex justify-end">
                <v-btn
                  v-if="!projectFile.plan3"
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    ;(projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan2)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan2Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan2Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan2Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan2Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan2')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 3 </cp-label>
              <div v-if="!projectFile.plan2" class="file-card-upload-disable">
                <div class="text-center">
                  <v-icon size="32" color="grey lighten-2">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 2 ก่อน</div>
                </div>
              </div>
              <div v-else-if="projectFile.plan3Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan3Preview"
                  aspect-ratio="1.4"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan3"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan3')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan3"
                  aspect-ratio="1.4"
                  contain
                  @click=";(projectFile.dialog = true), (projectFile.show = 3)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan3" class="pt-2 d-flex justify-end">
                <v-btn
                  v-if="!projectFile.plan4"
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    ;(projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan3)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan3Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan3Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan3Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan3Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan3')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <cp-label> แปลนที่ 4 </cp-label>
              <div v-if="!projectFile.plan3" class="file-card-upload-disable">
                <div class="text-center">
                  <v-icon size="32" color="grey lighten-2">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 3 ก่อน</div>
                </div>
              </div>
              <div v-else-if="projectFile.plan4Preview" class="image-zone">
                <v-img
                  :src="projectFile.plan4Preview"
                  aspect-ratio="1.4"
                  contain
                >
                </v-img>
              </div>
              <div
                v-else-if="!projectFile.plan4"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan4')"
              >
                <div class="text-center">
                  <v-icon size="32" class="upload-icon">
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div v-else class="image-zone">
                <v-img
                  :src="projectFile.plan4"
                  aspect-ratio="1.4"
                  contain
                  @click=";(projectFile.dialog = true), (projectFile.show = 4)"
                >
                  <div class="cp-img">
                    <v-icon color="white"> mdi-arrow-expand-all </v-icon>
                  </div>
                </v-img>
              </div>
              <div v-if="projectFile.plan4" class="pt-2 d-flex justify-end">
                <v-btn
                  small
                  outlined
                  elevation="0"
                  color="error"
                  class="ml-2"
                  @click="
                    ;(projectFile.delete.dialog = true),
                      (projectFile.delete.fileData = projectFile.plan4)
                  "
                >
                  ลบ
                </v-btn>
              </div>
              <div
                v-if="projectFile.plan4Preview"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  :disabled="projectFile.plan4Loading"
                  small
                  outlined
                  elevation="0"
                  @click="projectFile.plan4Preview = null"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  :loading="projectFile.plan4Loading"
                  small
                  elevation="0"
                  color="primary"
                  class="ml-2"
                  @click="onUploadProjectFile('plan4')"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </cp-card-max>
      </v-col>
    </v-row>

    <v-row>
      <!-- ทีมงาน -->
      <v-col cols="12">
        <cp-card class="pa-6">
          <div class="cp-title pl-4">หัวหน้าทีม</div>
          <div
            v-if="projectTeams.supervisor.length === 0"
            class="cp-no-team"
            @click="
              ;(addTeams.dialog = true),
                (addTeams.teamSelectType = 'supervisor')
            "
          >
            <span class="ml-2">เพิ่มหัวหน้าทีม</span>
          </div>
          <div v-else class="pa-4 d-flex align-center">
            <v-avatar size="55" color="primary">
              <v-img
                v-if="projectTeams.supervisor[0].avatar_path"
                :src="projectTeams.supervisor[0].avatar_path"
              />
              <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
            </v-avatar>

            <div class="ml-4 cp-subtitle">
              <div>
                <span>
                  <b>({{ projectTeams.supervisor[0].code_name }})</b>
                </span>
                <span class="ml-1">
                  {{
                    projectTeams.supervisor[0].first_name +
                    ' ' +
                    projectTeams.supervisor[0].last_name
                  }}</span
                >
              </div>

              <div class="green--text">
                <b>
                  {{ mapRoleName(projectTeams.supervisor[0].member_role) }}
                </b>
              </div>
            </div>

            <div class="ml-6">
              <v-btn
                v-if="role != 'Checker'"
                elevation="0"
                height="32"
                color="primary"
                outlined
                @click="
                  ;(addTeams.dialog = true),
                    (addTeams.teamSelectType = 'supervisor')
                "
              >
                เปลี่ยน
              </v-btn>
            </div>
          </div>

          <v-divider class="mb-6 mt-4" />

          <v-data-table
            :headers="projectTeams.headers"
            :items="projectTeams.checker"
            :loading="projectTeams.loading"
            class="elevation-0"
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>ทีม Checker</v-toolbar-title>
                <v-spacer />
                <v-btn
                  v-if="role != 'Checker'"
                  elevation="0"
                  height="36"
                  color="primary"
                  @click="
                    ;(addTeams.dialog = true),
                      (addTeams.teamSelectType = 'checker')
                  "
                >
                  <div class="cp-text-capitalize">
                    <v-icon left>mdi-plus</v-icon>
                    เพิ่ม Checker
                  </div>
                </v-btn>
              </v-toolbar>
            </template>

            <template #item.first_name="{ item }">
              <div class="col-user">
                <v-avatar size="40" color="primary">
                  <img v-if="item.avatar_path" :src="item.avatar_path" />
                  <v-img
                    v-else
                    :src="require('@/assets/images/no-avatar.png')"
                  />
                </v-avatar>
                <div>
                  <div class="cp-medium">
                    {{ item.first_name + ' ' + item.last_name }}
                  </div>
                </div>
              </div>
            </template>

            <template #item.member_role="{ item }">
              <div class="success--text">
                {{ mapRoleName(item.member_role) }}
              </div>
            </template>

            <template #item.actions="{ item }">
              <cp-col min="100">
                <v-icon
                  v-if="role != 'Checker'"
                  small
                  @click="
                    ;(deleteTeamChecker.dialog = true),
                      (deleteTeamChecker.data = item)
                  "
                >
                  mdi-trash-can-outline
                </v-icon>
                <v-icon v-else disabled small> mdi-delete-off-outline </v-icon>
              </cp-col>
            </template>

            <template #no-data>
              <div class="my-6">ไม่มีข้อมูลทีม Checker</div>
            </template>
          </v-data-table>
        </cp-card>
      </v-col>
    </v-row>

    <!-- Modal -->
    <!-- Project file show image -->
    <v-dialog
      v-model="projectFile.dialog"
      width="800"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          ไฟล์ภาพของโปรเจค
          <v-spacer />
          <v-btn icon class="mt-n4 mr-n4" @click="projectFile.dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-carousel v-model="projectFile.show" hide-delimiters>
            <v-carousel-item v-for="(item, i) in projectFile.items" :key="i">
              <div class="image-zone">
                <v-img :src="item.src" aspect-ratio="1.4" contain />
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete project file -->
    <v-dialog
      v-model="projectFile.delete.dialog"
      :persistent="projectFile.delete.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบไฟล์ภาพของโปรเจค
          <v-spacer />
          <v-btn
            :disabled="projectFile.delete.loading"
            icon
            class="mt-n4 mr-n4"
            @click="projectFile.delete.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบไฟล์ภาพของโปรเจคนี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="projectFile.delete.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteProjectFile()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create inspection -->
    <v-dialog
      v-model="projectInspection.dialog"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title>
          สร้างรายการตรวจสอบ
          <v-spacer />
          <v-btn
            icon
            class="mt-n4 mr-n4"
            @click="projectInspection.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <cp-label> วันที่เข้าตรวจ </cp-label>
          <v-menu
            v-model="projectInspection.workingDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="formattedWorkingDate"
                prepend-inner-icon="mdi-calendar-outline"
                placeholder="เลือกวันเข้าตรวจ"
                readonly
                dense
                outlined
                hide-details
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="projectInspection.workingDate"
              no-title
              locale="th-th"
              @input="projectInspection.workingDateMenu = false"
            />
          </v-menu>

          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="projectInspection.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="onCreateInspection()"
            >
              <div class="cp-text-capitalize">ยืนยันการสร้าง</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete inspection -->
    <v-dialog
      v-model="projectInspection.delete.dialog"
      :persistent="projectInspection.delete.loading"
      max-width="500px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบรายการตรวจ
          <v-spacer />
          <v-btn
            :disabled="projectInspection.delete.loading"
            icon
            class="mt-n4 mr-n4"
            @click="projectInspection.delete.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="mb-4">คุณแน่ใจหรือไม่ที่คุณจะลบรายการตรวจนี้?</div>
          <v-alert text outlined color="blue" icon="mdi-information-outline">
            รายการตรวจนี้อาจจะมีข้อมูล Location, System หรือรายการ Deflect อยู่
            โปรดตรวจสอบให้แน่ใจก่อนลบ เพราะการลบนี้จะทำให้ข้อมูลทั้งหมดหายไป
          </v-alert>
          <v-alert
            v-if="
              projectInspection.delete.reportStatus == 'approval' ||
              projectInspection.delete.reportStatus == 'approved'
            "
            text
            outlined
            color="warning"
            icon="mdi-alert-outline"
          >
            รายการตรวจนี้มีรายงานที่รอการยืนยันอยู่ไม่สามารถลบได้
          </v-alert>

          <v-card v-if="projectInspection.delete.loading" outlined>
            <v-card-text>
              <div class="d-flex align-cente justify-space-between cp-body">
                <div>
                  ลบรายการรูปภาพ ทั้งหมด
                  <b class="primary--text">
                    {{
                      projectInspection.delete.beforeStorageList
                        ? projectInspection.delete.beforeStorageList.length
                        : '-'
                    }}
                  </b>
                  ลบไปแล้ว
                  <b class="error--text">{{ deletedStorageCount }}</b>
                </div>
                <v-progress-circular
                  v-if="!projectInspection.delete.deletedStorage"
                  size="24"
                  indeterminate
                  color="primary"
                />
                <div v-else>
                  <v-icon color="success">mdi-check</v-icon>
                </div>
              </div>
              <div
                class="mt-4 d-flex align-center justify-space-between cp-body"
              >
                <div>ลบรายการ Location และ System</div>
                <v-progress-circular
                  v-if="!projectInspection.delete.deletedData"
                  size="24"
                  indeterminate
                  color="primary"
                />
                <div v-else>
                  <v-icon color="success">mdi-check</v-icon>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <div
            v-if="!projectInspection.delete.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :loading="projectInspection.delete.loading"
              :disabled="
                projectInspection.delete.reportStatus == 'approval' ||
                projectInspection.delete.reportStatus == 'approved'
              "
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteInspection()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Add Team -->
    <v-dialog
      v-model="addTeams.dialog"
      :persistent="addTeams.loading"
      width="600"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          เลือกทีมงาน
          <v-spacer />
          <v-btn
            :disabled="addTeams.loading"
            icon
            class="mt-n4 mr-n4"
            @click="addTeams.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="addTeams.teamList.length == 0" class="no-teams-list">
            ไม่มีรายการทีมงานเหลือแล้ว
          </div>
          <v-list v-else>
            <v-list-item
              v-for="(item, index) in addTeams.teamList"
              :key="index + 'teamList'"
              :disabled="addTeams.loading"
              class="py-2"
              @click="addTeamsSelect(item)"
            >
              <v-list-item-action>
                <v-icon v-if="item.active" color="primary">
                  mdi-checkbox-marked
                </v-icon>
                <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
              </v-list-item-action>

              <v-list-item-avatar>
                <img v-if="item.avatar_path" :src="item.avatar_path" />
                <v-img v-else :src="require('@/assets/images/no-avatar.png')" />
              </v-list-item-avatar>

              <v-list-item-content>
                <div class="cp-subtitle truncate py-2 pl-4">
                  {{ item.code_name }}
                </div>
              </v-list-item-content>

              <v-list-item-content>
                <div class="truncate">
                  {{ item.first_name + ' ' + item.last_name }}
                </div>
              </v-list-item-content>

              <v-list-item-content>
                <div class="success--text cp-semibold">
                  {{ mapRoleName(item.member_role) }}
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            :loading="addTeams.loading"
            :disabled="!addTeams.teamSelect"
            elevation="0"
            height="36"
            color="primary"
            class="px-4"
            @click="onAddProjectTeam()"
          >
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Team Checker -->
    <v-dialog
      v-model="deleteTeamChecker.dialog"
      :persistent="deleteTeamChecker.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Checker
          <v-spacer />
          <v-btn
            :disabled="deleteTeamChecker.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteTeamChecker.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบ Checker คนนี้ออกจากโปรเจค?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteTeamChecker.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteProjectTeamChecker()"
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

export default {
  data() {
    return {
      projectDetail: null,
      projectFile: {
        uploadType: '',
        main: null,
        mainPreview: null,
        mainLoading: false,
        plan1: null,
        plan1Preview: null,
        plan1Loading: false,
        plan2: null,
        plan2Preview: null,
        plan2Loading: false,
        plan3: null,
        plan3Preview: null,
        plan3Loading: false,
        plan4: null,
        plan4Preview: null,
        plan4Loading: false,
        dialog: false,
        show: 0,
        items: [],
        delete: {
          dialog: false,
          loading: false,
          fileData: null,
        },
      },
      projectTeams: {
        loading: false,
        headers: [
          {
            text: 'ทีมงาน',
            sortable: false,
            value: 'first_name',
          },
          { text: 'Code Name', value: 'code_name' },
          { text: 'บทบาท', value: 'member_role' },
          {
            text: 'การดำเนินการ',
            align: 'center',
            value: 'actions',
            sortable: false,
          },
        ],
        supervisor: [],
        checker: [],
      },
      projectInspection: {
        loading: false,
        dialog: false,
        workingDateMenu: false,
        workingDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        inspectionList: [],
        delete: {
          loading: false,
          dialog: false,
          inspectionId: '',
          reportStatus: '',
          beforeStorageList: null,
          deletedStorage: false,
          deletedData: false,
        },
      },
      deletedStorageCount: 0,
      editProjectName: {
        oldData: '',
        newData: '',
        focus: false,
        status: false,
        error: false,
      },
      editProjectNote: {
        oldData: '',
        newData: '',
        focus: false,
        status: false,
      },
      editTypeAddress: {
        oldData: '',
        newData: '',
        rules: [(v) => !/^\s+/.test(v) || 'ห้ามมีช่องว่างด้านหน้า'],
        focus: false,
        status: false,
        valid: false,
      },
      editTypeUsableArea: {
        oldData: '',
        newData: '',
        rules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || 'กรอกตัวเลขเท่านั้น',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCustomerName: {
        oldData: '',
        newData: '',
        rules: [
          (v) => !!v || 'ข้อมูลจำเป็น',
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || 'ห้ามใส่อักษรพิเศษ',
          (v) => !/^\s+/.test(v) || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCustomerPhone: {
        oldData: '',
        newData: '',
        rules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || 'กรอกตัวเลขเท่านั้น',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCustomerEmail: {
        oldData: '',
        newData: '',
        rules: [
          (v) =>
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v) ||
            v.length === 0 ||
            'กรอกอีเมลที่ถูกต้อง',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCoordinatorName: {
        oldData: '',
        newData: '',
        rules: [
          (v) =>
            /^[A-Za-z0-9ก-๏\s]+$/.test(v) ||
            v.length === 0 ||
            'ห้ามใส่อักษรพิเศษ',
          (v) => !/^\s+/.test(v) || v.length === 0 || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCoordinatorPhone: {
        oldData: '',
        newData: '',
        rules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || 'กรอกตัวเลขเท่านั้น',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      editCoordinatorEmail: {
        oldData: '',
        newData: '',
        rules: [
          (v) =>
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v) ||
            v.length === 0 ||
            'กรอกอีเมลที่ถูกต้อง',
        ],
        focus: false,
        status: false,
        valid: false,
      },
      addTeams: {
        loading: false,
        dialog: false,
        teamSelect: null,
        teamSelectType: null,
        teamList: [],
      },
      deleteTeamChecker: {
        loading: false,
        dialog: false,
        data: null,
      },
    }
  },

  head: {
    title: 'Project Detail',
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

    formattedWorkingDate() {
      if (this.projectInspection.workingDate) {
        return moment(this.projectInspection.workingDate).format('DD/MM/YYYY')
      } else {
        return ''
      }
    },
  },

  watch: {
    projectDetail(newValue) {
      if (newValue) {
        this.getCheckerTeam()
        this.getProjectFile()
      }
    },
    'editProjectName.newData'(newValue) {
      if (this.editProjectName.error) {
        this.editProjectName.error = false
      }
      this.editProjectName.status = newValue !== this.editProjectName.oldData
    },
    'editProjectNote.newData'(newValue) {
      this.editProjectNote.status = newValue !== this.editProjectNote.oldData
    },
    'editTypeAddress.newData'(newValue) {
      this.editTypeAddress.status = newValue !== this.editTypeAddress.oldData
    },
    'editTypeUsableArea.newData'(newValue) {
      this.editTypeUsableArea.status =
        Number(newValue) !== this.editTypeUsableArea.oldData
    },
    'editCustomerName.newData'(newValue) {
      this.editCustomerName.status = newValue !== this.editCustomerName.oldData
    },
    'editCustomerPhone.newData'(newValue) {
      this.editCustomerPhone.status =
        newValue !== this.editCustomerPhone.oldData
    },
    'editCustomerEmail.newData'(newValue) {
      this.editCustomerEmail.status =
        newValue !== this.editCustomerEmail.oldData
    },
    'editCoordinatorName.newData'(newValue) {
      this.editCoordinatorName.status =
        newValue !== this.editCoordinatorName.oldData
    },
    'editCoordinatorPhone.newData'(newValue) {
      this.editCoordinatorPhone.status =
        newValue !== this.editCoordinatorPhone.oldData
    },
    'editCoordinatorEmail.newData'(newValue) {
      this.editCoordinatorEmail.status =
        newValue !== this.editCoordinatorEmail.oldData
    },
    'projectInspection.delete.beforeStorageList'(newValue) {
      if (newValue) {
        this.onDeleteInspectionStorageCheck()
      }
    },
    'addTeams.dialog'(newValue) {
      if (newValue) {
        this.getMemberList()
      }
    },
  },

  created() {
    if (this.$route.query.id) {
      this.getProjectDetail()
      this.getInspectionList()
    } else {
      this.$router.push('/projects/list')
    }
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

    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    },

    mapRoleName(level) {
      const role = this.appRoleList.find((role) => role.role_level === level)
      return role ? role.role_name : null
    },

    chunkArray(array, chunkSize) {
      const result = []
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
      }
      return result
    },

    async getProjectDetail() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .get(
            `${process.env.API_ENDPOINT}/v1/project/detail/${this.$route.query.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectDetail = data.data
            if (this.projectDetail.checker_supervisor.code_name) {
              this.projectTeams.supervisor = []
              this.projectTeams.supervisor.push(
                this.projectDetail.checker_supervisor
              )
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

    async getCheckerTeam() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        if (accessToken) {
          this.$axios
            .get(
              `${process.env.API_ENDPOINT}/v1/project/checker-team/${this.$route.query.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              if (data.data) {
                this.projectTeams.checker = data.data
              } else {
                this.projectTeams.checker = []
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
      }
    },

    async getProjectFile() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        if (accessToken) {
          this.$axios
            .get(
              `${process.env.API_ENDPOINT}/v1/project/file/${this.$route.query.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectFile.main = null
              this.projectFile.plan1 = null
              this.projectFile.plan2 = null
              this.projectFile.plan3 = null
              this.projectFile.plan4 = null
              this.projectFile.items = []
              if (data.data) {
                for (const item of data.data) {
                  const fileTypes = {
                    main: 'main',
                    plan1: 'plan1',
                    plan2: 'plan2',
                    plan3: 'plan3',
                    plan4: 'plan4',
                  }

                  const fileType = fileTypes[item.file_type]

                  if (fileType) {
                    this.projectFile[fileType] = {
                      src: item.image_path,
                      type: item.file_type,
                    }
                    this.projectFile.items.push({
                      src: item.image_path,
                      type: item.file_type,
                    })
                    this.projectFile.items.sort((a, b) => {
                      const order = ['main', 'plan1', 'plan2', 'plan3', 'plan4']
                      const indexA = order.indexOf(a.type)
                      const indexB = order.indexOf(b.type)
                      return indexA - indexB
                    })
                  }
                }
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
      }
    },

    handleValidationError(message) {
      this.editProjectName.error = true
      this.onNotify({
        notifyValue: true,
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message,
      })
    },

    async saveNewProjectName() {
      const newData = this.editProjectName.newData

      if (newData.length === 0) {
        this.handleValidationError('กรอกข้อมูล')
        this.editProjectName.error = true
      } else if (!/^[A-Za-z0-9ก-๏\s]+$/.test(newData)) {
        this.handleValidationError('ห้ามใส่อักษรพิเศษ')
        this.editProjectName.error = true
      } else if (/^\s+/.test(newData)) {
        this.handleValidationError('ห้ามมีช่องว่างด้านหน้า')
        this.editProjectName.error = true
      } else {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/project-name`,
              {
                project_id: this.$route.query.id,
                project_name: this.editProjectName.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.project_name =
                this.editProjectName.newData.trim()
              this.editProjectName.oldData = ''
              this.editProjectName.newData = ''
              this.editProjectName.status = false
              this.editProjectName.focus = false
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
      }
    },

    async saveNewProjectNote() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/edit/project-note`,
            {
              project_id: this.$route.query.id,
              project_note: this.editProjectNote.newData.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectDetail.project_note =
              this.editProjectNote.newData.trim()
            this.editProjectNote.oldData = ''
            this.editProjectNote.newData = ''
            this.editProjectNote.status = false
            this.editProjectNote.focus = false
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

    async saveNewTypeAddress() {
      if (this.editTypeAddress.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/type-address`,
              {
                project_id: this.$route.query.id,
                type_address: this.editTypeAddress.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.type_address =
                this.editTypeAddress.newData.trim()
              this.editTypeAddress.oldData = ''
              this.editTypeAddress.newData = ''
              this.editTypeAddress.status = false
              this.editTypeAddress.focus = false
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
      }
    },

    async saveNewTypeUsableArea() {
      if (this.editTypeUsableArea.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/type-usable-area`,
              {
                project_id: this.$route.query.id,
                type_usable_area: parseInt(this.editTypeUsableArea.newData, 10),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.type_usable_area = parseInt(
                this.editTypeUsableArea.newData,
                10
              )
              this.editTypeUsableArea.oldData = ''
              this.editTypeUsableArea.newData = ''
              this.editTypeUsableArea.status = false
              this.editTypeUsableArea.focus = false
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
      }
    },

    async saveNewCustomerName() {
      if (this.editCustomerName.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-name`,
              {
                project_id: this.$route.query.id,
                customer_name: this.editCustomerName.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.customer.customer_name =
                this.editCustomerName.newData.trim()
              this.editCustomerName.oldData = ''
              this.editCustomerName.newData = ''
              this.editCustomerName.status = false
              this.editCustomerName.focus = false
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
      }
    },

    async saveNewCustomerPhone() {
      if (this.editCustomerPhone.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-phone`,
              {
                project_id: this.$route.query.id,
                customer_phone: this.editCustomerPhone.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.customer.customer_phone =
                this.editCustomerPhone.newData.trim()
              this.editCustomerPhone.oldData = ''
              this.editCustomerPhone.newData = ''
              this.editCustomerPhone.status = false
              this.editCustomerPhone.focus = false
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
      }
    },

    async saveNewCustomerEmail() {
      if (this.editCustomerEmail.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-email`,
              {
                project_id: this.$route.query.id,
                customer_email: this.editCustomerEmail.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.customer.customer_email =
                this.editCustomerEmail.newData.trim()
              this.editCustomerEmail.oldData = ''
              this.editCustomerEmail.newData = ''
              this.editCustomerEmail.status = false
              this.editCustomerEmail.focus = false
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
      }
    },

    async saveNewCoordinatorName() {
      if (this.editCoordinatorName.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-name`,
              {
                project_id: this.$route.query.id,
                coordinator_name: this.editCoordinatorName.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.coordinator.coordinator_name =
                this.editCoordinatorName.newData.trim()
              this.editCoordinatorName.oldData = ''
              this.editCoordinatorName.newData = ''
              this.editCoordinatorName.status = false
              this.editCoordinatorName.focus = false
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
      }
    },

    async saveNewCoordinatorPhone() {
      if (this.editCoordinatorPhone.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-phone`,
              {
                project_id: this.$route.query.id,
                coordinator_phone: this.editCoordinatorPhone.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.coordinator.coordinator_phone =
                this.editCoordinatorPhone.newData.trim()
              this.editCoordinatorPhone.oldData = ''
              this.editCoordinatorPhone.newData = ''
              this.editCoordinatorPhone.status = false
              this.editCoordinatorPhone.focus = false
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
      }
    },

    async saveNewCoordinatorEmail() {
      if (this.editCoordinatorEmail.valid) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-email`,
              {
                project_id: this.$route.query.id,
                coordinator_email: this.editCoordinatorEmail.newData.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(({ data }) => {
              this.projectDetail.coordinator.coordinator_email =
                this.editCoordinatorEmail.newData.trim()
              this.editCoordinatorEmail.oldData = ''
              this.editCoordinatorEmail.newData = ''
              this.editCoordinatorEmail.status = false
              this.editCoordinatorEmail.focus = false
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
      }
    },

    openImageInput() {
      this.$refs.imageInput.click()
    },

    uploadImage(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          if (this.projectFile.uploadType === 'main') {
            this.projectFile.mainPreview = reader.result
          } else if (this.projectFile.uploadType === 'plan1') {
            this.projectFile.plan1Preview = reader.result
          } else if (this.projectFile.uploadType === 'plan2') {
            this.projectFile.plan2Preview = reader.result
          } else if (this.projectFile.uploadType === 'plan3') {
            this.projectFile.plan3Preview = reader.result
          } else if (this.projectFile.uploadType === 'plan4') {
            this.projectFile.plan4Preview = reader.result
          }
          this.$refs.imageInput.value = null
        }
        reader.readAsDataURL(file)
      }
    },

    async onUploadProjectFile(fileType) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        let fileUpload = ''
        if (fileType === 'main') {
          this.projectFile.mainLoading = true
          fileUpload = this.projectFile.mainPreview
        } else if (fileType === 'plan1') {
          this.projectFile.plan1Loading = true
          fileUpload = this.projectFile.plan1Preview
        } else if (fileType === 'plan2') {
          this.projectFile.plan2Loading = true
          fileUpload = this.projectFile.plan2Preview
        } else if (fileType === 'plan3') {
          this.projectFile.plan3Loading = true
          fileUpload = this.projectFile.plan3Preview
        } else if (fileType === 'plan4') {
          this.projectFile.plan4Loading = true
          fileUpload = this.projectFile.plan4Preview
        }

        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/upload/file`,
            {
              project_id: this.$route.query.id,
              file_type: fileType,
              image: fileUpload,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (fileType === 'main') {
              this.projectFile.mainLoading = false
              this.projectFile.mainPreview = null
            } else if (fileType === 'plan1') {
              this.projectFile.plan1Loading = false
              this.projectFile.plan1Preview = null
            } else if (fileType === 'plan2') {
              this.projectFile.plan2Loading = false
              this.projectFile.plan2Preview = null
            } else if (fileType === 'plan3') {
              this.projectFile.plan3Loading = false
              this.projectFile.plan3Preview = null
            } else if (fileType === 'plan4') {
              this.projectFile.plan4Loading = false
              this.projectFile.plan4Preview = null
            }

            this.getProjectFile()
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data,
            })
            if (fileType === 'main') {
              this.projectFile.mainLoading = false
            } else if (fileType === 'plan1') {
              this.projectFile.plan1Loading = false
            } else if (fileType === 'plan2') {
              this.projectFile.plan2Loading = false
            } else if (fileType === 'plan3') {
              this.projectFile.plan3Loading = false
            } else if (fileType === 'plan4') {
              this.projectFile.plan4Loading = false
            }
          })
      }
    },

    async onDeleteProjectFile() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.projectFile.delete.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/delete/file`,
            {
              project_id: this.$route.query.id,
              file_type: this.projectFile.delete.fileData.type,
              image_path: this.projectFile.delete.fileData.src,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectFile.delete.dialog = false
            this.projectFile.delete.loading = false
            this.getProjectFile()
          })
          .catch(({ response }) => {
            this.projectFile.delete.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data,
            })
          })
      }
    },

    async getInspectionList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/list`,
            {
              project_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              data.data.sort((a, b) => a.id - b.id)
              this.projectInspection.inspectionList = data.data
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

    async onCreateInspection() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.projectInspection.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/create`,
            {
              project_id: this.$route.query.id,
              working_date: this.projectInspection.workingDate,
              inspection_no: this.projectInspection.inspectionList.length + 1,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectInspection.dialog = false
            this.projectInspection.loading = false
            this.getInspectionList()
            if (data.data) {
              this.getProjectDetail()
            }
          })
          .catch(({ response }) => {
            this.projectInspection.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data,
            })
          })
      }
    },

    async onDeleteInspection() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.projectInspection.delete.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/before-storage`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.projectInspection.delete.beforeStorageList = data.data
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

    async onDeleteInspectionStorageCheck() {
      if (this.projectInspection.delete.beforeStorageList.length <= 15) {
        if (this.projectInspection.delete.beforeStorageList.length === 0) {
          this.projectInspection.delete.deletedStorage = true
          this.deletedStorageCount = 0
          this.onDeleteInspectionData()
        } else {
          this.onDeleteInspectionStorage()
        }
      } else {
        const getArray = this.projectInspection.delete.beforeStorageList.map(
          (item) => item.image_id
        )
        const chunkedArray = this.chunkArray(getArray, 15)

        for (let i = 0; i < chunkedArray.length; i++) {
          await this.delayedDeleteInspectionStorageGroup(chunkedArray[i])
        }

        this.projectInspection.delete.deletedStorage = true
        this.onDeleteInspectionData()
      }
    },

    async delayedDeleteInspectionStorageGroup(chunk) {
      this.onDeleteInspectionStorageGroup(chunk)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    },

    async onDeleteInspectionStorage() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete-storage`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.projectInspection.delete.deletedStorage = true
            this.deletedStorageCount = data.data
            this.onDeleteInspectionData()
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

    async onDeleteInspectionData() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.projectInspection.delete.loading = true
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.getInspectionList()
            this.projectInspection.delete.deletedData = true
            setTimeout(() => {
              this.projectInspection.delete.dialog = false
            }, 500)
            setTimeout(() => {
              this.projectInspection.delete.loading = false
              this.projectInspection.delete.deletedData = false
              this.projectInspection.delete.deletedStorage = false
              this.getProjectDetail()
            }, 1000)
          })
          .catch(({ response }) => {
            this.projectInspection.delete.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data,
            })
          })
      }
    },

    async onDeleteInspectionStorageGroup(imageIdGroup) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete-storage-group`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.projectInspection.delete.inspectionId,
              image_id_group: imageIdGroup.toString(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deletedStorageCount = this.deletedStorageCount + data.data
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

    async getMemberList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/member/by-team`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data.data) {
              const combinedTeam = [
                ...this.projectTeams.supervisor,
                ...this.projectTeams.checker,
              ]

              data.data = data.data.filter(
                (obj1) =>
                  !combinedTeam.some(
                    (obj2) => obj2.account_id === obj1.account_id
                  )
              )

              this.addTeams.teamList = []
              for (let i = 0; i < data.data.length; i++) {
                data.data[i].active = false
                this.addTeams.teamList.push(data.data[i])
              }
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

    addTeamsSelect(data) {
      for (let i = 0; i < this.addTeams.teamList.length; i++) {
        this.addTeams.teamList[i].active = false
      }
      data.active = true
      this.addTeams.teamSelect = data
    },

    async onAddProjectTeam() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.addTeams.loading = true
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/add-teams`,
            {
              project_id: this.$route.query.id,
              account_id: this.addTeams.teamSelect.account_id,
              team_type: this.addTeams.teamSelectType,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (this.addTeams.teamSelectType === 'supervisor') {
              this.getProjectDetail()
            } else if (this.addTeams.teamSelectType === 'checker') {
              this.getCheckerTeam()
            }
            this.getMemberList()
            this.addTeams.loading = false
            this.addTeams.dialog = false
          })
          .catch((error) => {
            this.addTeams.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: error,
            })
          })
      }
    },

    async onDeleteProjectTeamChecker() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteTeamChecker.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/delete-checker`,
            {
              project_id: this.$route.query.id,
              account_id: this.deleteTeamChecker.data.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteTeamChecker.loading = false
            this.deleteTeamChecker.dialog = false
            this.getCheckerTeam()
          })
          .catch(({ response }) => {
            this.deleteTeamChecker.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data.data,
            })
          })
      }
    },

    async onCreateReport(data) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$router.push('/projects/reports/')
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/create`,
            {
              project_id: this.$route.query.id,
              inspection_id: data.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.$router.push(`/projects/reports/detail?id=${data.data}`)
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
  },
}
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
.box-edit-project-name {
  border-radius: 4px;
  padding: 4px 0;
  transition: all ease 0.3s;
}
.box-edit-project-name:hover {
  padding: 4px 8px;
  background-color: var(--gray-opacity-1);
}
.box-no-edit {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  padding: 4px 0;
}
.box-edit {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  padding: 4px 0;
  transition: all ease 0.3s;
}
.box-edit:hover {
  padding: 4px 8px;
  background-color: var(--gray-opacity-1);
}
.image-zone {
  background-color: var(--gray-100);
}
.file-card-upload-main {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 245px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--gray-500);
  transition: all ease 0.3s;
}
.file-card-upload-main .upload-icon {
  color: var(--gray-500);
}
.file-card-upload-main:hover {
  border: 3px dotted var(--base-primary);
  color: var(--base-primary);
}
.file-card-upload-main:hover .upload-icon {
  color: var(--base-primary);
}
.file-card-upload-disable {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 130px;
  border-radius: 4px;
  color: var(--gray-300);
}
.file-card-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 130px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--gray-500);
  transition: all ease 0.3s;
}
.file-card-upload .upload-icon {
  color: var(--gray-500);
}
.file-card-upload:hover {
  border: 3px dotted var(--base-primary);
  color: var(--base-primary);
}
.file-card-upload:hover .upload-icon {
  color: var(--base-primary);
}
.cp-no-team {
  width: 300px;
  height: 55px;
  padding: 16px;
  margin: 16px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
  background-color: var(--gray-opacity-1);
  transition: all ease 0.3s;
}
.cp-no-team:hover {
  background-color: var(--gray-opacity-2);
}
.cp-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  transition: all ease 0.3s;
}
.cp-img:hover {
  opacity: 1;
  background-color: var(--gray-opacity-2);
}
.cp-inspection-no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--gray-500);
  height: 200px;
  background-color: var(--gray-opacity-1);
}
.cp-inspection-card {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  gap: 16px;
  border: 1px solid var(--gray-300);
  transition: all ease 0.3s;
}
.cp-inspection-card:hover {
  background-color: var(--gray-opacity-1);
}
.cp-inspection-card-no {
  width: 200px;
}
.cp-inspection-card-detail {
  width: 100%;
}
.cp-inspection-card-action {
  width: 50px;
}
.delete-inspection {
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 8px;
  cursor: pointer;
  height: 40px;
  transition: all ease 0.3s;
}
.delete-inspection:hover {
  color: var(--base-error);
  background-color: var(--red-opacity-2);
}
.delete-inspection:hover .delete-inspection-icon {
  color: var(--base-error);
}
.col-user {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
}
.no-teams-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border-radius: 4px;
  border: 1px solid var(--gray-300);
  background-color: var(--gray-opacity-1);
}
</style>
