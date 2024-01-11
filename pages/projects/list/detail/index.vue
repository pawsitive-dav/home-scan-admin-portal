<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span
        class="mr-1"
        @click="$router.push('/projects/list')"
      >
        <cp-link> รายการโปรเจค </cp-link>
      </span>
      /
      <span
        v-if="!projectDetail"
        class="mx-1 cp-text-disable"
      >...</span>
      <span
        v-else
        class="mx-1 cp-text-disable"
      >
        {{ projectDetail ? projectDetail.project_name : '' }}
      </span>
    </div>

    <v-row
      v-if="!projectDetail"
      class="mt-2"
    >
      <v-col cols="12">
        <div class="d-flex">
          <v-sheet
            color="grey lighten-2"
            width="300"
            height="30"
          />
          <v-sheet
            color="grey lighten-2"
            width="100"
            height="30"
            class="ml-4"
          />
        </div>
        <v-sheet
          color="grey lighten-2"
          width="500"
          height="20"
          class="mt-6"
        />
      </v-col>
    </v-row>

    <v-row
      v-if="projectDetail"
      class="mt-2"
    >
      <v-col cols="12">
        <div class="d-flex align-center cp-header-2 cp-bold mb-2">
          <div
            v-if="editProjectName.oldData.length === 0"
            class="box-edit-project-name mr-2"
            @click="
              (editProjectName.oldData = projectDetail.project_name),
              (editProjectName.newData = projectDetail.project_name),
              (editProjectName.focus = true)
            "
          >
            {{ projectDetail.project_name }}
          </div>
          <v-sheet
            v-else
            width="500"
            class="mr-2"
          >
            <v-text-field
              v-model="editProjectName.newData"
              :append-icon="editProjectName.status ? 'mdi-content-save-outline' : ''
              "
              :autofocus="editProjectName.focus"
              :error="editProjectName.error"
              dense
              outlined
              hide-details
              @blur="saveNewProjectName()"
              @click:append="saveNewProjectName()"
            />
          </v-sheet>

          <v-chip
            v-if="projectDetail.project_status == 'to-do'"
            label
          >
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
        <div class="mb-2 d-md-none">
          <b>ประเภท:</b>
          <span class="primary--text cp-semibold cp-subtitle">
            {{ projectDetail.type_name }}
          </span>
        </div>
        <div class="d-flex align-center">
          <b class="hidden-sm-and-down">ประเภท:</b>
          <span class="ml-1 mr-4 primary--text cp-semibold cp-subtitle hidden-sm-and-down">
            {{ projectDetail.type_name }}
          </span>
          <b>วันที่สร้าง:</b>
          <span class="cp-text-description ml-1">
            {{ formatDateMax(projectDetail.created_at) }}
          </span>

          <b class="ml-4">สร้างโดย:</b>
          <span class="cp-text-description ml-1">
            ({{ projectDetail.created_by.code_name }})
            {{ projectDetail.created_by.first_name + ' ' + projectDetail.created_by.last_name }}
          </span>
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="8"
        md="8"
        lg="8"
      >
        <v-row>
          <!-- Project Detail -->
          <v-col cols="12">
            <cp-card class="pa-6">
              <v-row>
                <!-- หมายเหตุ: บอกทีมหน้างาน -->
                <v-col cols="12">
                  <div class="cp-text-description">
                    หมายเหตุ: บอกทีมหน้างาน
                  </div>
                  <div
                    v-if="!editProjectNote.focus"
                    class="box-edit-note"
                    @click="(editProjectNote.oldData = projectDetail.project_note || ''),
                            (editProjectNote.newData = projectDetail.project_note || ''),
                            (editProjectNote.focus = true)
                    "
                  >
                    {{ projectDetail.project_note || '-' }}
                  </div>
                  <v-textarea
                    v-else
                    v-model="editProjectNote.newData"
                    :append-icon="editProjectNote.status ? 'mdi-content-save-outline' : ''
                    "
                    :autofocus="editProjectNote.focus"
                    counter="250"
                    maxlength="250"
                    rows="3"
                    outlined
                    auto-grow
                    @blur="saveNewProjectNote()"
                    @click:append="saveNewProjectNote()"
                  />
                </v-col>

                <!-- เลขที่ -->
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <div class="cp-text-description">
                    เลขที่
                  </div>
                  <div
                    v-if="!editTypeAddress.focus"
                    class="box-edit"
                    @click="
                      (editTypeAddress.oldData = projectDetail.type_address),
                      (editTypeAddress.newData = projectDetail.type_address),
                      (editTypeAddress.focus = true)"
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
                      :append-icon="editTypeAddress.status ? 'mdi-content-save-outline' : ''
                      "
                      :autofocus="editTypeAddress.focus"
                      :rules="editTypeAddress.rules"
                      dense
                      outlined
                      @blur="saveNewTypeAddress()"
                      @click:append="saveNewTypeAddress()"
                    />
                  </v-form>
                </v-col>

                <!-- พื้นที่ใช้สอย -->
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <div class="cp-text-description">
                    พื้นที่ใช้สอย
                  </div>
                  <div
                    v-if="!editTypeUsableArea.focus"
                    class="box-edit"
                    @click="(editTypeUsableArea.oldData = projectDetail.type_usable_area || ''),
                            (editTypeUsableArea.newData = projectDetail.type_usable_area || ''),
                            (editTypeUsableArea.focus = true)
                    "
                  >
                    {{ projectDetail.type_usable_area || '-' }}
                    <span
                      v-if="projectDetail.type_usable_area"
                      class="ml-2"
                    >
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
                      :append-icon="editTypeUsableArea.status
                        ? 'mdi-content-save-outline'
                        : ''
                      "
                      :autofocus="editTypeUsableArea.focus"
                      :rules="editTypeUsableArea.rules"
                      suffix="ตร.ม."
                      dense
                      outlined
                      @blur="saveNewTypeUsableArea()"
                      @click:append="saveNewTypeUsableArea()"
                    />
                  </v-form>
                </v-col>

                <v-col cols="12">
                  <v-divider />
                </v-col>

                <!-- ข้อมูลลูกค้า -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">
                    ข้อมูลลูกค้า
                  </div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        ชื่อ
                      </div>
                      <div
                        v-if="!editCustomerName.focus"
                        class="box-edit"
                        @click="(editCustomerName.oldData = projectDetail.customer.customer_name),
                                (editCustomerName.newData = projectDetail.customer.customer_name),
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
                          :append-icon="editCustomerName.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCustomerName.focus"
                          :rules="editCustomerName.rules"
                          dense
                          outlined
                          @blur="saveNewCustomerName()"
                          @click:append="saveNewCustomerName()"
                        />
                      </v-form>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        เบอร์โทรศัพท์
                      </div>
                      <div
                        v-if="!editCustomerPhone.focus"
                        class="box-edit"
                        @click="(editCustomerPhone.oldData = projectDetail.customer.customer_phone || ''),
                                (editCustomerPhone.newData = projectDetail.customer.customer_phone || ''),
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
                          :append-icon="editCustomerPhone.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCustomerPhone.focus"
                          :rules="editCustomerPhone.rules"
                          maxlength="10"
                          counter="10"
                          dense
                          outlined
                          @blur="saveNewCustomerPhone()"
                          @click:append="saveNewCustomerPhone()"
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                  <v-row>
                    <!-- อีเมล 1 -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        อีเมล 1
                      </div>
                      <div
                        v-if="!editCustomerEmail1.focus"
                        class="box-edit truncate"
                        @click="(editCustomerEmail1.oldData = projectDetail.customer.customer_email_1 || ''),
                                (editCustomerEmail1.newData = projectDetail.customer.customer_email_1 || ''),
                                (editCustomerEmail1.focus = true)"
                      >
                        {{ projectDetail.customer.customer_email_1 || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCustomerEmail1"
                        v-model="editCustomerEmail1.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCustomerEmail1.newData"
                          :append-icon="editCustomerEmail1.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCustomerEmail1.focus"
                          dense
                          outlined
                          @blur="saveNewCustomerEmail(1)"
                          @click:append="saveNewCustomerEmail(1)"
                        />
                      </v-form>
                    </v-col>
                    <!-- อีเมล 2 -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        อีเมล 2
                      </div>
                      <div
                        v-if="!editCustomerEmail2.focus"
                        class="box-edit truncate"
                        @click="(editCustomerEmail2.oldData = projectDetail.customer.customer_email_2 || ''),
                                (editCustomerEmail2.newData = projectDetail.customer.customer_email_2 || ''),
                                (editCustomerEmail2.focus = true)"
                      >
                        {{ projectDetail.customer.customer_email_2 || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCustomerEmail2"
                        v-model="editCustomerEmail2.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCustomerEmail2.newData"
                          :append-icon="editCustomerEmail2.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCustomerEmail2.focus"
                          dense
                          outlined
                          @blur="saveNewCustomerEmail(2)"
                          @click:append="saveNewCustomerEmail(2)"
                        />
                      </v-form>
                    </v-col>
                    <!-- อีเมล 3 -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        อีเมล 3
                      </div>
                      <div
                        v-if="!editCustomerEmail3.focus"
                        class="box-edit truncate"
                        @click="(editCustomerEmail3.oldData = projectDetail.customer.customer_email_3 || ''),
                                (editCustomerEmail3.newData = projectDetail.customer.customer_email_3 || ''),
                                (editCustomerEmail3.focus = true)"
                      >
                        {{ projectDetail.customer.customer_email_3 || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCustomerEmail3"
                        v-model="editCustomerEmail3.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCustomerEmail3.newData"
                          :append-icon="editCustomerEmail3.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCustomerEmail3.focus"
                          dense
                          outlined
                          @blur="saveNewCustomerEmail(3)"
                          @click:append="saveNewCustomerEmail(3)"
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- ข้อมูลเจ้าหน้าที่โครงการ -->
                <v-col cols="12">
                  <div class="cp-subtitle pb-4">
                    ข้อมูลเจ้าหน้าที่โครงการ
                  </div>
                  <v-row>
                    <!-- ชื่อ -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        ชื่อ
                      </div>
                      <div
                        v-if="!editCoordinatorName.focus"
                        class="box-edit"
                        @click="(editCoordinatorName.oldData = projectDetail.coordinator.coordinator_name || ''),
                                (editCoordinatorName.newData = projectDetail.coordinator.coordinator_name || ''),
                                (editCoordinatorName.focus = true)"
                      >
                        {{ projectDetail.coordinator.coordinator_name || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorName"
                        v-model="editCoordinatorName.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorName.newData"
                          :append-icon="editCoordinatorName.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCoordinatorName.focus"
                          :rules="editCoordinatorName.rules"
                          dense
                          outlined
                          @blur="saveNewCoordinatorName()"
                          @click:append="saveNewCoordinatorName()"
                        />
                      </v-form>
                    </v-col>

                    <!-- เบอร์โทรศัพท์ -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        เบอร์โทรศัพท์
                      </div>
                      <div
                        v-if="!editCoordinatorPhone.focus"
                        class="box-edit"
                        @click="(editCoordinatorPhone.oldData = projectDetail.coordinator.coordinator_phone || ''),
                                (editCoordinatorPhone.newData = projectDetail.coordinator.coordinator_phone || ''),
                                (editCoordinatorPhone.focus = true)"
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
                          :append-icon="editCoordinatorPhone.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCoordinatorPhone.focus"
                          :rules="editCoordinatorPhone.rules"
                          maxlength="10"
                          counter="10"
                          dense
                          outlined
                          @blur="saveNewCoordinatorPhone()"
                          @click:append="saveNewCoordinatorPhone()"
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                  <v-row>
                    <!-- อีเมล 1 -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        อีเมล 1
                      </div>
                      <div
                        v-if="!editCoordinatorEmail1.focus"
                        class="box-edit truncate"
                        @click="(editCoordinatorEmail1.oldData = projectDetail.coordinator.coordinator_email_1 || ''),
                                (editCoordinatorEmail1.newData = projectDetail.coordinator.coordinator_email_1 || ''),
                                (editCoordinatorEmail1.focus = true)"
                      >
                        {{ projectDetail.coordinator.coordinator_email_1 || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorEmail1"
                        v-model="editCoordinatorEmail1.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorEmail1.newData"
                          :append-icon="editCoordinatorEmail1.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCoordinatorEmail1.focus"
                          dense
                          outlined
                          @blur="saveNewCoordinatorEmail(1)"
                          @click:append="saveNewCoordinatorEmail(1)"
                        />
                      </v-form>
                    </v-col>
                    <!-- อีเมล 2 -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        อีเมล 2
                      </div>
                      <div
                        v-if="!editCoordinatorEmail2.focus"
                        class="box-edit truncate"
                        @click="(editCoordinatorEmail2.oldData = projectDetail.coordinator.coordinator_email_2 || ''),
                                (editCoordinatorEmail2.newData = projectDetail.coordinator.coordinator_email_2 || ''),
                                (editCoordinatorEmail2.focus = true)"
                      >
                        {{ projectDetail.coordinator.coordinator_email_2 || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorEmail2"
                        v-model="editCoordinatorEmail2.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorEmail2.newData"
                          :append-icon="editCoordinatorEmail2.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCoordinatorEmail2.focus"
                          dense
                          outlined
                          @blur="saveNewCoordinatorEmail(2)"
                          @click:append="saveNewCoordinatorEmail(2)"
                        />
                      </v-form>
                    </v-col>
                    <!-- อีเมล 3 -->
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div class="cp-text-description">
                        อีเมล 3
                      </div>
                      <div
                        v-if="!editCoordinatorEmail3.focus"
                        class="box-edit truncate"
                        @click="(editCoordinatorEmail3.oldData = projectDetail.coordinator.coordinator_email_3 || ''),
                                (editCoordinatorEmail3.newData = projectDetail.coordinator.coordinator_email_3 || ''),
                                (editCoordinatorEmail3.focus = true)"
                      >
                        {{ projectDetail.coordinator.coordinator_email_3 || '-' }}
                      </div>
                      <v-form
                        v-else
                        ref="formEditCoordinatorEmail3"
                        v-model="editCoordinatorEmail3.valid"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="editCoordinatorEmail3.newData"
                          :append-icon="editCoordinatorEmail3.status
                            ? 'mdi-content-save-outline'
                            : ''
                          "
                          :autofocus="editCoordinatorEmail3.focus"
                          dense
                          outlined
                          @blur="saveNewCoordinatorEmail(3)"
                          @click:append="saveNewCoordinatorEmail(3)"
                        />
                      </v-form>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </cp-card>
          </v-col>

          <!-- Project Team -->
          <v-col cols="12">
            <cp-card-max class="pa-6">
              <div class="cp-title pl-4">
                หัวหน้าทีม
              </div>
              <div
                v-if="projectTeams.supervisor.length === 0 && role == 'Checker'"
                class="cp-no-team-no-action"
              >
                ยังไม่มีหัวหน้าทีม
              </div>
              <div v-else>
                <div
                  v-if="projectTeams.supervisor.length === 0"
                  class="cp-no-team"
                  @click="
                  ; (addTeams.dialog = true),
                  (addTeams.teamSelectType = 'supervisor') "
                >
                  <span class="ml-2">เพิ่มหัวหน้าทีม</span>
                </div>
                <div
                  v-else
                  class="pa-4 d-flex align-center"
                >
                  <v-avatar
                    size="55"
                    color="primary"
                  >
                    <v-img
                      v-if="projectTeams.supervisor[0].avatar_path"
                      :src="projectTeams.supervisor[0].avatar_path"
                    />
                    <v-img
                      v-else
                      :src="require('@/assets/images/no-avatar.png')"
                    />
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
                        }}</span>
                    </div>

                    <div class="green--text">
                      <b>
                        {{
                          mapRoleName(projectTeams.supervisor[0].member_role)
                        }}
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
                      ; (addTeams.dialog = true),
                      (addTeams.teamSelectType = 'supervisor')
                      "
                    >
                      เปลี่ยน
                    </v-btn>
                  </div>
                </div>
              </div>

              <v-divider class="mb-6 mt-4" />

              <v-data-table
                :headers="projectTeams.headers"
                :items="projectTeams.checker"
                :loading="projectTeams.loading"
                :items-per-page="-1"
                hide-default-footer
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
                       ; (addTeams.dialog = true),
                      (addTeams.teamSelectType = 'checker')
                      "
                    >
                      <div class="cp-text-capitalize">
                        <v-icon left>
                          mdi-plus
                        </v-icon>
                        เพิ่ม Checker
                      </div>
                    </v-btn>
                  </v-toolbar>
                </template>

                <template #item.first_name="{ item }">
                  <div class="col-user">
                    <v-avatar
                      size="40"
                      color="primary"
                    >
                      <img
                        v-if="item.avatar_path"
                        :src="item.avatar_path"
                      >
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
                      ; (deleteTeamChecker.dialog = true),
                      (deleteTeamChecker.data = item)
                      "
                    >
                      mdi-trash-can-outline
                    </v-icon>
                    <v-icon
                      v-else
                      disabled
                      small
                    >
                      mdi-delete-off-outline
                    </v-icon>
                  </cp-col>
                </template>

                <template #no-data>
                  <div class="my-6">
                    ไม่มีข้อมูลทีม Checker
                  </div>
                </template>
              </v-data-table>
            </cp-card-max>
          </v-col>
        </v-row>
      </v-col>

      <!-- ไฟล์ภาพของโปรเจค -->
      <v-col
        cols="12"
        sm="4"
        md="4"
        lg="4"
      >
        <cp-card-max class="pa-6">
          <div class="cp-subtitle pb-4">
            ไฟล์ภาพของโปรเจค
          </div>
          <v-row>
            <v-col cols="12">
              <input
                ref="imageInput"
                type="file"
                style="display: none"
                accept="image/*"
                @change="uploadImage"
              >
              <cp-label> รูปโปรเจค </cp-label>
              <div
                v-if="projectFile.mainPreview"
                class="image-zone"
              >
                <v-img
                  :src="projectFile.mainPreview"
                  aspect-ratio="1.6"
                />
              </div>
              <div
                v-else-if="!projectFile.main"
                class="file-card-upload-main"
                @click="openImageInput(), (projectFile.uploadType = 'main')"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    class="upload-icon"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div
                v-else
                class="image-zone"
              >
                <v-img
                  :src="projectFile.main.src"
                  aspect-ratio="1.6"
                  @click="; (projectFile.dialog = true), (projectFile.show = 0)"
                >
                  <div class="cp-img">
                    <v-icon
                      color="white"
                      large
                    >
                      mdi-arrow-expand-all
                    </v-icon>
                  </div>
                </v-img>
              </div>
              <div
                v-if="projectFile.main"
                class="pt-2 d-flex"
              >
                <v-spacer />
                <v-btn
                  icon
                  @click="onDonwloadImage(projectFile.main.src, 'รูปโปรเจค')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="
                  ; (projectFile.delete.dialog = true),
                  (projectFile.delete.fileData = projectFile.main)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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

            <v-col
              cols="12"
              md="6"
            >
              <cp-label> แปลนที่ 1 </cp-label>
              <div
                v-if="projectFile.plan1Preview"
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan1Preview"
                  aspect-ratio="1.6"
                  contain
                />
              </div>
              <div
                v-else-if="!projectFile.plan1"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan1')"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    class="upload-icon"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div
                v-else
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan1"
                  aspect-ratio="1.6"
                  contain
                  @click="; (projectFile.dialog = true), (projectFile.show = 1)"
                >
                  <div class="cp-img">
                    <v-icon color="white">
                      mdi-arrow-expand-all
                    </v-icon>
                  </div>
                </v-img>
              </div>
              <div
                v-if="projectFile.plan1"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  icon
                  @click="onDonwloadImage(projectFile.plan1.src, 'รูปแปลน-1')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!projectFile.plan2"
                  icon
                  @click="
                  ; (projectFile.delete.dialog = true),
                  (projectFile.delete.fileData = projectFile.plan1)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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

            <v-col
              cols="12"
              md="6"
            >
              <cp-label> แปลนที่ 2 </cp-label>
              <div
                v-if="!projectFile.plan1"
                class="file-card-upload-disable"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    color="grey lighten-2"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 1 ก่อน</div>
                </div>
              </div>
              <div
                v-else-if="projectFile.plan2Preview"
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan2Preview"
                  aspect-ratio="1.6"
                  contain
                />
              </div>
              <div
                v-else-if="!projectFile.plan2"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan2')"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    class="upload-icon"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div
                v-else
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan2"
                  aspect-ratio="1.6"
                  contain
                  @click="; (projectFile.dialog = true), (projectFile.show = 2)"
                >
                  <div class="cp-img">
                    <v-icon color="white">
                      mdi-arrow-expand-all
                    </v-icon>
                  </div>
                </v-img>
              </div>
              <div
                v-if="projectFile.plan2"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  icon
                  @click="onDonwloadImage(projectFile.plan2.src, 'รูปแปลน-2')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!projectFile.plan3"
                  icon
                  @click="
                    ; (projectFile.delete.dialog = true),
                  (projectFile.delete.fileData = projectFile.plan2)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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

            <v-col
              cols="12"
              md="6"
            >
              <cp-label> แปลนที่ 3 </cp-label>
              <div
                v-if="!projectFile.plan2"
                class="file-card-upload-disable"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    color="grey lighten-2"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 2 ก่อน</div>
                </div>
              </div>
              <div
                v-else-if="projectFile.plan3Preview"
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan3Preview"
                  aspect-ratio="1.6"
                  contain
                />
              </div>
              <div
                v-else-if="!projectFile.plan3"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan3')"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    class="upload-icon"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div
                v-else
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan3"
                  aspect-ratio="1.6"
                  contain
                  @click="; (projectFile.dialog = true), (projectFile.show = 3)"
                >
                  <div class="cp-img">
                    <v-icon color="white">
                      mdi-arrow-expand-all
                    </v-icon>
                  </div>
                </v-img>
              </div>
              <div
                v-if="projectFile.plan3"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  icon
                  @click="onDonwloadImage(projectFile.plan3.src, 'รูปแปลน-3')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!projectFile.plan4"
                  icon
                  @click="
                  ; (projectFile.delete.dialog = true),
                  (projectFile.delete.fileData = projectFile.plan3)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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

            <v-col
              cols="12"
              md="6"
            >
              <cp-label> แปลนที่ 4 </cp-label>
              <div
                v-if="!projectFile.plan3"
                class="file-card-upload-disable"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    color="grey lighten-2"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดแปลน 3 ก่อน</div>
                </div>
              </div>
              <div
                v-else-if="projectFile.plan4Preview"
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan4Preview"
                  aspect-ratio="1.6"
                  contain
                />
              </div>
              <div
                v-else-if="!projectFile.plan4"
                class="file-card-upload"
                @click="openImageInput(), (projectFile.uploadType = 'plan4')"
              >
                <div class="text-center">
                  <v-icon
                    size="32"
                    class="upload-icon"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <div>อัพโหลดรูป</div>
                </div>
              </div>
              <div
                v-else
                class="image-zone"
              >
                <v-img
                  :src="projectFile.plan4"
                  aspect-ratio="1.6"
                  contain
                  @click="; (projectFile.dialog = true), (projectFile.show = 4)"
                >
                  <div class="cp-img">
                    <v-icon color="white">
                      mdi-arrow-expand-all
                    </v-icon>
                  </div>
                </v-img>
              </div>
              <div
                v-if="projectFile.plan4"
                class="pt-2 d-flex justify-end"
              >
                <v-btn
                  icon
                  @click="onDonwloadImage(projectFile.plan4.src, 'รูปแปลน-4')"
                >
                  <v-icon>mdi-cloud-download-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="
                  ; (projectFile.delete.dialog = true),
                  (projectFile.delete.fileData = projectFile.plan4)
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
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

    <!-- รายการตรวจ -->
    <v-row v-if="projectDetail">
      <v-col cols="12">
        <cp-card
          class="pa-6"
          style="height: 100%"
        >
          <div class="d-flex pb-4">
            <div class="cp-subtitle pb-4">
              รายการตรวจ
            </div>
            <v-spacer />
            <v-btn
              v-if="role != 'Checker'"
              :disabled="projectDetail.project_status == 'in-progress' ||
                projectDetail.project_status == 'report-approval' ||
                (projectDetail.project_status == 'to-do' &&
                  projectTeams.supervisor.length === 0 &&
                  projectInspection.inspectionList.length > 0)
              "
              color="primary"
              elevation="0"
              @click="projectInspection.dialog = true"
            >
              <v-icon left>
                mdi-list-box-outline
              </v-icon>
              สร้างรายการตรวจสอบ
            </v-btn>
          </div>

          <div v-if="projectInspection.inspectionList.length === 0">
            <v-card
              elevation="0"
              color="grey lighten-5"
            >
              <v-card-text>
                <div class="text-center cp-text-disable py-6">
                  ไม่มีข้อมูลรายการตรวจ
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-card
            v-for="(list, index) in projectInspection.inspectionList"
            :key="index + 'inspection-list'"
            outlined
          >
            <v-card-title>
              <div>รายการตรวจที่ {{ list.inspection_no }}</div>
              <!-- Status -->
              <div>
                <v-chip
                  v-if="list.report_status === 'in-progress'"
                  small
                  label
                  color="warning"
                  class="ml-2"
                >
                  กำลังดำเนินการ
                </v-chip>
                <v-chip
                  v-if="list.report_status === 'approval'"
                  small
                  label
                  color="info"
                  class="ml-2"
                >
                  รายงานรอการยืนยัน
                </v-chip>
                <v-chip
                  v-if="list.report_status === 'approved'"
                  small
                  label
                  color="success"
                  class="ml-2"
                >
                  รายงานได้รับการยืนยัน
                </v-chip>
              </div>
              <v-spacer />
              <!-- Menu -->
              <v-menu
                :close-on-content-click="false"
                bottom
                left
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list
                  dense
                  nav
                >
                  <div v-if="!list.report_id">
                    <v-list-item
                      v-if="role == 'Project Manager' ||
                        role == 'Admin' ||
                        role == 'Supervisor'
                      "
                      :disabled="projectDetail.project_status == 'to-do'"
                      @click="onCreateReport(list)"
                    >
                      สร้างรายงาน
                    </v-list-item>
                  </div>
                  <div v-else>
                    <v-list-item
                      @click="
                        $router.push(
                          `/projects/reports/detail?id=${list.report_id}`
                        )
                      "
                    >
                      ดูรายงาน
                    </v-list-item>
                  </div>
                  <div
                    v-if="role == 'Project Manager' ||
                      role == 'Admin' ||
                      role == 'Supervisor'
                    "
                  >
                    <div
                      v-if="projectInspection.inspectionList.length ==
                        list.inspection_no
                      "
                      class="delete-inspection"
                      @click="; (deleteInspection.dialog = true), (deleteInspection.inspectionData = list)"
                    >
                      ลบรายการตรวจ
                    </div>
                  </div>
                </v-list>
              </v-menu>
              <v-btn
                color="primary"
                elevation="0"
                class="ml-4"
                @click="
                  $router.push(
                    `/projects/list/detail/inspection?id=${list.inspection_id}`
                  )
                "
              >
                ดูรายละเอียด
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-divider class="mb-4" />
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  md="4"
                >
                  <div class="pb-4">
                    <b>รายละเอียด : </b>
                  </div>
                  <v-row no-gutters>
                    <v-col
                      cols="4"
                      sm="4"
                      md="4"
                      lg="4"
                      class="mt-2"
                    >
                      <div class="cp-text-description">
                        สร้างโดย:
                      </div>
                    </v-col>
                    <v-col
                      cols="8"
                      sm="8"
                      md="8"
                      lg="8"
                      class="mt-2"
                    >
                      <b>{{ list.created_by.code_name }}</b>
                    </v-col>
                    <v-col
                      cols="4"
                      sm="4"
                      md="4"
                      lg="4"
                      class="mt-2"
                    >
                      <div class="cp-text-description">
                        วันที่เข้าตรวจ:
                      </div>
                    </v-col>
                    <v-col
                      cols="8"
                      sm="8"
                      md="8"
                      lg="8"
                      class="mt-2"
                    >
                      <b>{{ formatDate(list.working_date) }}</b>
                    </v-col>
                    <v-col
                      cols="4"
                      sm="4"
                      md="4"
                      lg="4"
                      class="mt-2"
                    >
                      <div class="cp-text-description">
                        รายงาน:
                      </div>
                    </v-col>
                    <v-col
                      cols="8"
                      sm="8"
                      md="8"
                      lg="8"
                      class="mt-2"
                    >
                      <div v-if="!list.report_id">
                        <div
                          v-if="projectDetail.project_status == 'to-do'"
                          class="cp-text-disable"
                        >
                          ต้องเพิ่มหัวหน้าทีมก่อน
                        </div>
                        <div v-else>
                          <cp-link
                            v-if="role == 'Project Manager' ||
                              role == 'Admin' ||
                              role == 'Supervisor'
                            "
                            class="primary--text"
                            @click="onCreateReport(list)"
                          >
                            สร้างรายงาน
                          </cp-link>
                        </div>
                      </div>
                      <div v-else>
                        <cp-link
                          class="primary--text"
                          @click="$router.push(`/projects/reports/detail?id=${list.report_id}`)"
                        >
                          ดูรายงาน
                        </cp-link>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  sm="7"
                  md="8"
                >
                  <div class="d-flex align-center pb-4">
                    <div><b>หมายเหตุ : </b> รายงาน</div>
                    <v-spacer />
                    <div>
                      <v-btn
                        color="primary"
                        elevation="0"
                        outlined
                        small
                        @click="; (createInspectionNote.dialog = true), (createInspectionNote.data = list)"
                      >
                        เพิ่มหมายเหตุ
                      </v-btn>
                    </div>
                  </div>
                  <v-card
                    v-if="list.inspection_note.length === 0"
                    elevation="0"
                    color="grey lighten-4"
                  >
                    <v-card-text>
                      <div class="cp-text-disable text-center">
                        ไม่มีรายการหมายเหตุ
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-expansion-panels v-else>
                    <v-expansion-panel
                      v-for="(item, i) in list.inspection_note"
                      :key="i"
                    >
                      <v-expansion-panel-header v-slot="{ open }">
                        <div v-if="!open">
                          {{ item.edit_note_title }}
                        </div>
                        <div
                          v-else
                          class="cp-text-description"
                        >
                          แก้ไขหมายเหตุ
                        </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div class="d-flex">
                          <v-sheet
                            min-width="40px"
                            class="text-center pr-4"
                          >
                            <div>
                              <v-btn
                                :disabled="i + 1 === 1"
                                icon
                                color="info"
                                @click="moveLocationItemList('up', item.note_id, item.inspection_id)"
                              >
                                <v-icon>mdi-arrow-up-bold</v-icon>
                              </v-btn>
                            </div>
                            <div class="cp-subtitle py-4">
                              <b>{{ i + 1 }}</b>
                            </div>
                            <div>
                              <v-btn
                                :disabled="i + 1 === list.inspection_note.length"
                                icon
                                color="info"
                                @click="moveLocationItemList('down', item.note_id, item.inspection_id)"
                              >
                                <v-icon>mdi-arrow-down-bold</v-icon>
                              </v-btn>
                            </div>
                          </v-sheet>
                          <v-sheet width="100%">
                            <v-text-field
                              v-model="item.edit_note_title"
                              :rules="item.titleRules"
                              :append-icon="item.edit_note_title === item.note_title
                                ? ''
                                : 'mdi-sync'
                              "
                              counter="80"
                              maxlength="80"
                              outlined
                              dense
                              @click:append="item.edit_note_title = item.note_title"
                            />
                            <v-textarea
                              v-model="item.edit_note_message"
                              :append-icon="item.edit_note_message === item.note_message
                                ? ''
                                : 'mdi-sync'
                              "
                              placeholder="เพิ่มรายการหมายเหตุ"
                              rows="5"
                              outlined
                              no-resize
                              hide-details
                              @click:append=" item.edit_note_message = item.note_message"
                            />
                            <div class="d-flex align-center pt-4">
                              <v-btn
                                color="error"
                                text
                                small
                                @click="; (deleteInspectionNote.dialog = true), (deleteInspectionNote.data = item)"
                              >
                                ลบหมายเหตู
                              </v-btn>
                              <v-spacer />
                              <v-btn
                                :disabled="(item.edit_note_title === item.note_title &&
                                  item.edit_note_message ===
                                  item.note_message) ||
                                  item.edit_note_title.length === 0
                                "
                                color="primary"
                                elevation="0"
                                small
                                @click="onUpdateInspectionNote(item)"
                              >
                                บันทึก
                              </v-btn>
                            </div>
                          </v-sheet>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
          <v-btn
            icon
            class="mt-n4 mr-n4"
            @click="projectFile.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-carousel
            v-model="projectFile.show"
            hide-delimiters
          >
            <v-carousel-item
              v-for="(item, i) in projectFile.items"
              :key="i"
            >
              <div class="image-zone">
                <v-img
                  :src="item.src"
                  aspect-ratio="1.6"
                  contain
                />
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
              <div class="cp-text-capitalize">
                ยืนยัน
              </div>
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
              <div class="cp-text-capitalize">
                ยืนยันการสร้าง
              </div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete inspection -->
    <v-dialog
      v-model="deleteInspection.dialog"
      :persistent="deleteInspection.loading"
      max-width="450px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card v-if="deleteInspection.inspectionData">
        <v-card-title>
          ลบ รายการตรวจที่
          {{ deleteInspection.inspectionData.inspection_no }}
          <v-spacer />
          <v-btn
            :disabled="deleteInspection.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteInspection.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            รายการที่จะถูกลบมีดังนี้
          </div>
          <v-row no-gutters>
            <v-col cols="4">
              รายงาน
            </v-col>
            <v-col cols="8">
              <div v-if="deleteInspection.reportDeleteDone">
                <b class="success--text">ถูกลบแล้ว</b>
              </div>
              <div v-else>
                <div
                  v-if="deleteInspection.loading &&
                    deleteInspection.inspectionData.report_id
                  "
                >
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">ดำเนินการลบ...</span>
                </div>
                <div v-else>
                  <span v-if="!deleteInspection.inspectionData.report_id">
                    ไม่มีรายงาน
                  </span>
                  <span v-else><b>1</b> รายการ</span>
                </div>
              </div>
            </v-col>

            <v-col
              cols="4"
              class="mt-2"
            >
              Location
            </v-col>
            <v-col
              cols="8"
              class="mt-2"
            >
              <div v-if="deleteInspection.locationDeleteDone">
                <b class="success--text">ถูกลบแล้ว</b>
              </div>
              <div v-else>
                <div v-if="deleteInspection.loading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">ดำเนินการลบ...</span>
                </div>
                <div v-else>
                  <div v-if="deleteInspection.beforeDataLoading">
                    <v-progress-circular
                      :width="2"
                      size="16"
                      color="grey"
                      class="mr-1"
                      indeterminate
                    />
                    <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                  </div>
                  <div v-else>
                    <b>{{ deleteInspection.location.length }}</b>
                    รายการ
                  </div>
                </div>
              </div>
            </v-col>

            <v-col
              cols="4"
              class="mt-2"
            >
              System
            </v-col>
            <v-col
              cols="8"
              class="mt-2"
            >
              <div v-if="deleteInspection.systemDeleteDone">
                <b class="success--text">ถูกลบแล้ว</b>
              </div>
              <div v-else>
                <div v-if="deleteInspection.loading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">ดำเนินการลบ...</span>
                </div>
                <div v-else>
                  <div v-if="deleteInspection.beforeDataLoading">
                    <v-progress-circular
                      :width="2"
                      size="16"
                      color="grey"
                      class="mr-1"
                      indeterminate
                    />
                    <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                  </div>
                  <div v-else>
                    <b>{{ deleteInspection.system.length }}</b>
                    รายการ
                  </div>
                </div>
              </div>
            </v-col>

            <v-col
              cols="4"
              class="mt-2"
            >
              Location Deflect
            </v-col>
            <v-col
              cols="8"
              class="mt-2"
            >
              <div v-if="deleteInspection.loading">
                <v-progress-linear
                  v-model="deleteInspection.locationProgress"
                  color="info"
                  height="20"
                  rounded
                >
                  <strong class="white--text">
                    {{ deleteInspection.locationProgress }}%
                  </strong>
                </v-progress-linear>
              </div>
              <div v-else>
                <div v-if="deleteInspection.beforeDataLoading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                </div>
                <div v-else>
                  <b>{{ deleteInspection.locationDeflect.length }}</b>
                  รายการ
                </div>
              </div>
            </v-col>

            <v-col
              cols="4"
              class="mt-2"
            >
              System Deflect
            </v-col>
            <v-col
              cols="8"
              class="mt-2"
            >
              <div v-if="deleteInspection.loading">
                <v-progress-linear
                  v-model="deleteInspection.systemProgress"
                  color="info"
                  height="20"
                  rounded
                >
                  <strong class="white--text">
                    {{ deleteInspection.systemProgress }}%
                  </strong>
                </v-progress-linear>
              </div>
              <div v-else>
                <div v-if="deleteInspection.beforeDataLoading">
                  <v-progress-circular
                    :width="2"
                    size="16"
                    color="grey"
                    class="mr-1"
                    indeterminate
                  />
                  <span class="cp-text-disable">กำลังตรวจสอบข้อมูล...</span>
                </div>
                <div v-else>
                  <b>{{ deleteInspection.systemDeflect.length }}</b>
                  รายการ
                </div>
              </div>
            </v-col>
          </v-row>

          <div
            v-if="!deleteInspection.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :disabled="deleteInspection.beforeDataLoading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteInspection()"
            >
              <div class="cp-text-capitalize">
                ยืนยัน
              </div>
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
          <div
            v-if="addTeams.teamList.length == 0"
            class="no-teams-list"
          >
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
                <v-icon
                  v-if="item.active"
                  color="primary"
                >
                  mdi-checkbox-marked
                </v-icon>
                <v-icon v-else>
                  mdi-checkbox-blank-outline
                </v-icon>
              </v-list-item-action>

              <v-list-item-avatar>
                <img
                  v-if="item.avatar_path"
                  :src="item.avatar_path"
                >
                <v-img
                  v-else
                  :src="require('@/assets/images/no-avatar.png')"
                />
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
              <div class="cp-text-capitalize">
                ยืนยัน
              </div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create Inspection Note -->
    <v-dialog
      v-model="createInspectionNote.dialog"
      :persistent="createInspectionNote.loading"
      width="400"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          สร้างหมายเหตุ
          <v-spacer />
          <v-btn
            :disabled="createInspectionNote.loading"
            icon
            class="mt-n4 mr-n4"
            @click="createInspectionNote.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="formCreateNote"
            v-model="createInspectionNote.valid"
            lazy-validation
          >
            <cp-label>หัวข้อหมายเหตุ</cp-label>
            <v-text-field
              v-model="createInspectionNote.title"
              :rules="createInspectionNote.titleRules"
              outlined
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            :loading="createInspectionNote.loading"
            :disabled="!createInspectionNote.valid"
            elevation="0"
            height="36"
            color="primary"
            class="px-4"
            @click="onCreateInspectionNote()"
          >
            สร้าง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Inspection Note -->
    <v-dialog
      v-model="deleteInspectionNote.dialog"
      :persistent="deleteInspectionNote.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ หมายเหตุ
          <v-spacer />
          <v-btn
            :disabled="deleteInspectionNote.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteInspectionNote.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบหมายเหตุนี้ออกจากรายการตรวจ?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteInspectionNote.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteInspectionNote()"
            >
              <div class="cp-text-capitalize">
                ยืนยัน
              </div>
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
        loading: false,
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
          { text: 'Code Name', value: 'code_name', sortable: false },
          { text: 'บทบาท', value: 'member_role', sortable: false },
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
      },
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
      editCustomerEmail1: {
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
      editCustomerEmail2: {
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
      editCustomerEmail3: {
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
      editCoordinatorEmail1: {
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
      editCoordinatorEmail2: {
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
      editCoordinatorEmail3: {
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
      deleteInspection: {
        loading: false,
        dialog: false,
        inspectionData: null,
        beforeDataLoading: false,
        location: [],
        locationDeflect: [],
        locationProgress: 0,
        system: [],
        systemDeflect: [],
        systemProgress: 0,
        reportDeleteDone: false,
        locationDeleteDone: false,
        systemDeleteDone: false,
      },
      createInspectionNote: {
        dialog: false,
        loading: false,
        valid: false,
        title: '',
        titleRules: [
          (v) => !!v || 'ขอมูลจำเป็น',
          (v) => /^(?!\s)/.test(v) || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        data: null,
      },
      deleteInspectionNote: {
        dialog: false,
        loading: false,
        data: null,
      },
    }
  },

  head: {
    title: 'Project Detail',
  },

  computed: {
    ...mapState('user', ['role', 'appRoleList']),

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
    'editCustomerEmail1.newData'(newValue) {
      this.editCustomerEmail1.status =
        newValue !== this.editCustomerEmail1.oldData
    },
    'editCustomerEmail2.newData'(newValue) {
      this.editCustomerEmail2.status =
        newValue !== this.editCustomerEmail2.oldData
    },
    'editCustomerEmail3.newData'(newValue) {
      this.editCustomerEmail3.status =
        newValue !== this.editCustomerEmail3.oldData
    },
    'editCoordinatorName.newData'(newValue) {
      this.editCoordinatorName.status =
        newValue !== this.editCoordinatorName.oldData
    },
    'editCoordinatorPhone.newData'(newValue) {
      this.editCoordinatorPhone.status =
        newValue !== this.editCoordinatorPhone.oldData
    },
    'editCoordinatorEmail1.newData'(newValue) {
      this.editCoordinatorEmail1.status =
        newValue !== this.editCoordinatorEmail1.oldData
    },
    'editCoordinatorEmail2.newData'(newValue) {
      this.editCoordinatorEmail2.status =
        newValue !== this.editCoordinatorEmail2.oldData
    },
    'editCoordinatorEmail3.newData'(newValue) {
      this.editCoordinatorEmail3.status =
        newValue !== this.editCoordinatorEmail3.oldData
    },
    async 'addTeams.dialog'(newValue) {
      if (newValue) {
        await this.getProjectDetail()
        await this.getCheckerTeam()
        this.getMemberList()
        this.getInspectionList()
      }
    },
    async 'projectFile.delete.dialog'(newValue) {
      if (newValue) {
        await this.getProjectFile()
        const x = setInterval(() => {
          if (!this.projectFile.loading) {
            if (
              this.projectFile.delete.fileData.type === 'main' &&
              this.projectFile.main === null
            ) {
              this.projectFile.delete.dialog = false
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: 'รูปภาพถูกลบจากผู้ใช้งานท่านอื่น',
              })
            } else if (
              this.projectFile.delete.fileData.type === 'plan1' &&
              this.projectFile.plan1 === null
            ) {
              this.projectFile.delete.dialog = false
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: 'รูปภาพถูกลบจากผู้ใช้งานท่านอื่น',
              })
            } else if (
              this.projectFile.delete.fileData.type === 'plan2' &&
              this.projectFile.plan2 === null
            ) {
              this.projectFile.delete.dialog = false
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: 'รูปภาพถูกลบจากผู้ใช้งานท่านอื่น',
              })
            } else if (
              this.projectFile.delete.fileData.type === 'plan3' &&
              this.projectFile.plan3 === null
            ) {
              this.projectFile.delete.dialog = false
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: 'รูปภาพถูกลบจากผู้ใช้งานท่านอื่น',
              })
            } else if (
              this.projectFile.delete.fileData.type === 'plan4' &&
              this.projectFile.plan4 === null
            ) {
              this.projectFile.delete.dialog = false
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: 'รูปภาพถูกลบจากผู้ใช้งานท่านอื่น',
              })
            }
            clearInterval(x)
          }
        }, 300)
      }
    },
    'deleteInspection.dialog'(newValue) {
      if (newValue) {
        this.onBeforeDeleteInspection()
      }
    },
    'createInspectionNote.dialog'(newValue) {
      if (!newValue) {
        this.$refs.formCreateNote.reset()
        this.createInspectionNote.data = null
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
            if (data.data.customer.customer_email) {
              const customerEmail = data.data.customer.customer_email.split(",");
              data.data.customer.customer_email_1 = customerEmail[0] || null;
              data.data.customer.customer_email_2 = customerEmail[1] || null;
              data.data.customer.customer_email_3 = customerEmail[2] || null;
            } else {
              data.data.customer.customer_email_1 = null;
              data.data.customer.customer_email_2 = null;
              data.data.customer.customer_email_3 = null;
            }
            if (data.data.coordinator.coordinator_email) {
              const coordinatorEmail = data.data.coordinator.coordinator_email.split(",");
              data.data.coordinator.coordinator_email_1 = coordinatorEmail[0] || null;
              data.data.coordinator.coordinator_email_2 = coordinatorEmail[1] || null;
              data.data.coordinator.coordinator_email_3 = coordinatorEmail[2] || null;
            } else {
              data.data.coordinator.coordinator_email_1 = null;
              data.data.coordinator.coordinator_email_2 = null;
              data.data.coordinator.coordinator_email_3 = null;
            }
            this.projectDetail = data.data
            if (this.projectDetail.checker_supervisor.code_name) {
              this.projectTeams.supervisor = []
              this.projectTeams.supervisor.push(
                this.projectDetail.checker_supervisor
              )
            }
          })
          .catch(({ response }) => {
            if (response.data.statusCode === 404) {
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: 'ผู้ใช้งานท่านอื่นลบโปรเจคนี้แล้ว',
              })
              this.$router.push('/projects/list')
            } else {
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: response.data,
              })
            }
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
        this.projectFile.loading = true
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
              this.projectFile.loading = false
            } else {
              this.projectFile.loading = false
            }
          })
          .catch(({ response }) => {
            this.projectFile.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: response.data,
            })
          })
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
      } else if (
        this.editProjectName.oldData !== this.editProjectName.newData
      ) {
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
            .then(() => {
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
      } else {
        this.projectDetail.project_name = this.editProjectName.newData.trim()
        this.editProjectName.oldData = ''
        this.editProjectName.newData = ''
        this.editProjectName.status = false
        this.editProjectName.focus = false
      }
    },

    async saveNewProjectNote() {
      if (this.editProjectNote.oldData !== this.editProjectNote.newData) {
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
            .then(() => {
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
      } else {
        this.projectDetail.project_note = this.editProjectNote.newData.trim()
        this.editProjectNote.oldData = ''
        this.editProjectNote.newData = ''
        this.editProjectNote.status = false
        this.editProjectNote.focus = false
      }
    },

    async saveNewTypeAddress() {
      if (this.editTypeAddress.valid && this.editTypeAddress.status) {
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
            .then(() => {
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
      } else {
        if (this.editTypeAddress.newData) {
          this.projectDetail.type_address = this.editTypeAddress.newData.trim()
        } else {
          this.projectDetail.type_address = this.editTypeAddress.newData
        }
        this.editTypeAddress.oldData = ''
        this.editTypeAddress.newData = ''
        this.editTypeAddress.status = false
        this.editTypeAddress.focus = false
      }
    },

    async saveNewTypeUsableArea() {
      if (this.editTypeUsableArea.valid && this.editTypeUsableArea.status) {
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
            .then(() => {
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
      } else {
        this.projectDetail.type_usable_area = parseInt(
          this.editTypeUsableArea.newData,
          10
        )
        this.editTypeUsableArea.oldData = ''
        this.editTypeUsableArea.newData = ''
        this.editTypeUsableArea.status = false
        this.editTypeUsableArea.focus = false
      }
    },

    async saveNewCustomerName() {
      if (this.editCustomerName.valid && this.editCustomerName.status) {
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
            .then(() => {
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
      } else {
        this.editCustomerName.oldData = ''
        this.editCustomerName.newData = ''
        this.editCustomerName.status = false
        this.editCustomerName.focus = false
      }
    },

    async saveNewCustomerPhone() {
      if (this.editCustomerPhone.valid && this.editCustomerPhone.status) {
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
            .then(() => {
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
      } else {
        this.editCustomerPhone.oldData = ''
        this.editCustomerPhone.newData = ''
        this.editCustomerPhone.status = false
        this.editCustomerPhone.focus = false
      }
    },

    async saveNewCustomerEmail(mailNumber) {
      if (this.editCustomerEmail1.status || this.editCustomerEmail2.status || this.editCustomerEmail3.status) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          if (mailNumber === 1) {
            this.projectDetail.customer.customer_email_1 = this.editCustomerEmail1.newData.trim()
          } else if (mailNumber === 2) {
            this.projectDetail.customer.customer_email_2 = this.editCustomerEmail2.newData.trim()
          } else if (mailNumber === 3) {
            this.projectDetail.customer.customer_email_3 = this.editCustomerEmail3.newData.trim()
          }
          const groupCustomerEmail = [
            this.projectDetail.customer.customer_email_1, 
            this.projectDetail.customer.customer_email_2, 
            this.projectDetail.customer.customer_email_3
          ].filter(email => email).join(",");
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/customer-email`,
              {
                project_id: this.$route.query.id,
                customer_email: groupCustomerEmail,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(() => {
              this.editCustomerEmail1.oldData = ''
              this.editCustomerEmail1.newData = ''
              this.editCustomerEmail1.status = false
              this.editCustomerEmail1.focus = false

              this.editCustomerEmail2.oldData = ''
              this.editCustomerEmail2.newData = ''
              this.editCustomerEmail2.status = false
              this.editCustomerEmail2.focus = false

              this.editCustomerEmail3.oldData = ''
              this.editCustomerEmail3.newData = ''
              this.editCustomerEmail3.status = false
              this.editCustomerEmail3.focus = false

              this.getProjectDetail()
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
      } else {
        this.editCustomerEmail1.oldData = ''
        this.editCustomerEmail1.newData = ''
        this.editCustomerEmail1.status = false
        this.editCustomerEmail1.focus = false

        this.editCustomerEmail2.oldData = ''
        this.editCustomerEmail2.newData = ''
        this.editCustomerEmail2.status = false
        this.editCustomerEmail2.focus = false

        this.editCustomerEmail3.oldData = ''
        this.editCustomerEmail3.newData = ''
        this.editCustomerEmail3.status = false
        this.editCustomerEmail3.focus = false
      }
    },

    async saveNewCoordinatorName() {
      if (this.editCoordinatorName.valid && this.editCoordinatorName.status) {
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
            .then(() => {
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
      } else {
        this.editCoordinatorName.oldData = ''
        this.editCoordinatorName.newData = ''
        this.editCoordinatorName.status = false
        this.editCoordinatorName.focus = false
      }
    },

    async saveNewCoordinatorPhone() {
      if (this.editCoordinatorPhone.valid && this.editCoordinatorPhone.status) {
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
            .then(() => {
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
      } else {
        this.editCoordinatorPhone.oldData = ''
        this.editCoordinatorPhone.newData = ''
        this.editCoordinatorPhone.status = false
        this.editCoordinatorPhone.focus = false
      }
    },

    async saveNewCoordinatorEmail(mailNumber) {
      if (this.editCoordinatorEmail1.status || this.editCoordinatorEmail2.status || this.editCoordinatorEmail3.status) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          if (mailNumber === 1) {
            this.projectDetail.coordinator.coordinator_email_1 = this.editCoordinatorEmail1.newData.trim()
          } else if (mailNumber === 2) {
            this.projectDetail.coordinator.coordinator_email_2 = this.editCoordinatorEmail2.newData.trim()
          } else if (mailNumber === 3) {
            this.projectDetail.coordinator.coordinator_email_3 = this.editCoordinatorEmail3.newData.trim()
          }
          const groupCoordinatorEmail = [
            this.projectDetail.coordinator.coordinator_email_1, 
            this.projectDetail.coordinator.coordinator_email_2, 
            this.projectDetail.coordinator.coordinator_email_3
          ].filter(email => email).join(",");
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/edit/coordinator-email`,
              {
                project_id: this.$route.query.id,
                coordinator_email: groupCoordinatorEmail,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(() => {
              this.editCoordinatorEmail1.oldData = ''
              this.editCoordinatorEmail1.newData = ''
              this.editCoordinatorEmail1.status = false
              this.editCoordinatorEmail1.focus = false

              this.editCoordinatorEmail2.oldData = ''
              this.editCoordinatorEmail2.newData = ''
              this.editCoordinatorEmail2.status = false
              this.editCoordinatorEmail2.focus = false

              this.editCoordinatorEmail3.oldData = ''
              this.editCoordinatorEmail3.newData = ''
              this.editCoordinatorEmail3.status = false
              this.editCoordinatorEmail3.focus = false

              this.getProjectDetail()
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
      } else {
        this.editCoordinatorEmail1.oldData = ''
        this.editCoordinatorEmail1.newData = ''
        this.editCoordinatorEmail1.status = false
        this.editCoordinatorEmail1.focus = false

        this.editCoordinatorEmail2.oldData = ''
        this.editCoordinatorEmail2.newData = ''
        this.editCoordinatorEmail2.status = false
        this.editCoordinatorEmail2.focus = false

        this.editCoordinatorEmail3.oldData = ''
        this.editCoordinatorEmail3.newData = ''
        this.editCoordinatorEmail3.status = false
        this.editCoordinatorEmail3.focus = false
      }
    },

    async openImageInput() {
      await this.getProjectFile()
      const x = setInterval(() => {
        if (!this.projectFile.loading) {
          if (
            this.projectFile.uploadType === 'main' &&
            this.projectFile.main === null
          ) {
            this.$refs.imageInput.click()
          } else if (
            this.projectFile.uploadType === 'plan1' &&
            this.projectFile.plan1 === null
          ) {
            this.$refs.imageInput.click()
          } else if (
            this.projectFile.uploadType === 'plan2' &&
            this.projectFile.plan2 === null &&
            this.projectFile.plan1 !== null
          ) {
            this.$refs.imageInput.click()
          } else if (
            this.projectFile.uploadType === 'plan3' &&
            this.projectFile.plan3 === null &&
            this.projectFile.plan2 !== null
          ) {
            this.$refs.imageInput.click()
          } else if (
            this.projectFile.uploadType === 'plan4' &&
            this.projectFile.plan4 === null &&
            this.projectFile.plan3 !== null
          ) {
            this.$refs.imageInput.click()
          } else {
            this.onNotify({
              notifyValue: true,
              type: 'info',
              title: 'ข้อความจากระบบ',
              message: 'รูปภาพถูกแก้ไขจากผู้ใช้งานท่านอื่น',
            })
          }

          clearInterval(x)
        }
      }, 500)
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
          .then(() => {
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
            if (response.data.statusCode === 409) {
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message:
                  'มีผู้ใช้งานท่านอื่นอัพโหลดรูปไว้แล้ว ระบบได้ดำเนินการโหลดข้อมูลให้ใหม่เรียบร้อยแล้ว',
              })
              this.getProjectFile()
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
            } else {
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
          .then(() => {
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
              data.data.forEach((inspection) => {
                inspection.inspection_note.forEach((note) => {
                  note.titleRules = [(v) => !!v || 'ขอมูลจำเป็น']
                  note.edit_note_title = note.note_title
                  if (note.note_message) {
                    const newlineContent = note.note_message.replace(
                      /<br \/>/g,
                      ''
                    )
                    note.note_message = newlineContent
                    note.edit_note_message = newlineContent
                  } else {
                    note.note_message = ''
                    note.edit_note_message = ''
                  }
                })
                inspection.inspection_note.sort(
                  (a, b) => a.item_number - b.item_number
                )
              })
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
            if (response.data.statusCode === 409) {
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: `มีรายการตรวจที่ ${this.projectInspection.inspectionList.length + 1
                  } ในระบบแล้ว ระบบได้ดำเนินการโหลดข้อมูลให้ใหม่สำเร็จ`,
              })
              this.projectInspection.loading = false
              this.projectInspection.dialog = false
              this.getInspectionList()
              this.getProjectDetail()
            } else {
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: response,
              })
            }
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
          .then(() => {
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
          .then(() => {
            this.deleteTeamChecker.loading = false
            this.deleteTeamChecker.dialog = false
            this.getCheckerTeam()
          })
          .catch(() => {
            this.deleteTeamChecker.loading = false
            this.deleteTeamChecker.dialog = false
            this.onNotify({
              notifyValue: true,
              type: 'warning',
              title: 'แจ้งเตือนจากระบบ',
              message: 'Checker ถูกผู้ใช้งานท่านอื่นลบแล้ว',
            })
            this.getCheckerTeam()
          })
      }
    },

    async onCreateReport(data) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
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
            if (data) {
              this.$router.push(`/projects/reports/detail?id=${data.data}`)
            }
          })
          .catch(({ response }) => {
            if (response.data.statusCode === 404) {
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: 'รายการตรวจนี้ถูกลบจากผู้ใช้งานท่านอื่นแล้ว',
              })
              this.getProjectDetail()
              this.getInspectionList()
            } else if (response.data.statusCode === 409) {
              this.onNotify({
                notifyValue: true,
                type: 'info',
                title: 'ข้อความจากระบบ',
                message: 'รายงานถูกผู้ใช้งานท่านอื่นสร้างไว้แล้ว',
              })
              this.getProjectDetail()
              this.getInspectionList()
            } else {
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: response,
              })
            }
          })
      }
    },

    async onDonwloadImage(imageUrl, fileName) {
      const base64String = await this.getImageBase64(imageUrl)
      if (base64String.image) {
        const checkDevice = this.checkDeviceType()
        if (checkDevice === 'Desktop') {
          const a = document.createElement('a')
          a.href = base64String.image
          a.download = fileName || 'no-name' + '.jpeg'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        } else if (checkDevice === 'iPad') {
          alert(checkDevice)
        } else if (checkDevice === 'Mobile') {
          alert(checkDevice)
        } else {
          alert('Unknown')
        }
      }
    },

    checkDeviceType() {
      const userAgent = navigator.userAgent.toLowerCase()
      const platform = navigator.platform.toLowerCase()
      if (
        userAgent.includes('win') ||
        userAgent.includes('mac') ||
        userAgent.includes('linux')
      ) {
        return 'Desktop'
      }
      if (userAgent.includes('ipad')) {
        return 'iPad'
      }
      if (
        userAgent.includes('android') ||
        userAgent.includes('iphone') ||
        userAgent.includes('mobile') ||
        platform.includes('win')
      ) {
        return 'Mobile'
      }
      return 'Unknown'
    },

    async getImageBase64(imagePath) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        try {
          const response = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/report/image-64`,
            {
              image_path: imagePath,
              page_focus: 'project',
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
            message:
              'ไม่สามารถบันทึกรูปภาพได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบรูปภาพนี้แล้ว',
          })
        }
      }
    },

    handleUploadError(error) {
      this.imageUpload.loading = false
      this.onNotify({
        notifyValue: true,
        type: 'error',
        title: 'ดำเนินการไม่สำเร็จ',
        message: error,
      })
    },

    async onBeforeDeleteInspection() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteInspection.beforeDataLoading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/before-delete`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.deleteInspection.inspectionData.inspection_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.deleteInspection.location = data.data.location
              this.deleteInspection.locationDeflect = data.data.location_deflect
              this.deleteInspection.system = data.data.system
              this.deleteInspection.systemDeflect = data.data.system_deflect
              this.deleteInspection.beforeDataLoading = false
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

    async onDeleteInspection() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteInspection.loading = true
        const projectId = this.$route.query.id
        const inspectionId = this.deleteInspection.inspectionData.inspection_id

        // Delete Report
        if (this.deleteInspection.inspectionData.report_id) {
          await this.runDeleteInspectionReport(
            accessToken,
            projectId,
            inspectionId
          )
        }

        // Delete Location Deflect
        if (this.deleteInspection.locationDeflect.length === 0) {
          this.deleteInspection.locationProgress = 100
        } else {
          for (
            let i = 0;
            i < this.deleteInspection.locationDeflect.length;
            i++
          ) {
            const locationId =
              this.deleteInspection.locationDeflect[i].location_id
            const imageId = this.deleteInspection.locationDeflect[i].image_id
            const imagePath =
              this.deleteInspection.locationDeflect[i].image_path
            await this.runMultipleDeleteLocationDeflect(
              accessToken,
              projectId,
              inspectionId,
              locationId,
              imageId,
              imagePath,
              i
            )
          }
        }

        // Delete System Deflect
        if (this.deleteInspection.systemDeflect.length === 0) {
          this.deleteInspection.systemProgress = 100
        } else {
          for (let i = 0; i < this.deleteInspection.systemDeflect.length; i++) {
            const systemId = this.deleteInspection.systemDeflect[i].system_id
            const imageId = this.deleteInspection.systemDeflect[i].image_id
            const imagePath = this.deleteInspection.systemDeflect[i].image_path
            await this.runMultipleDeleteSystemDeflect(
              accessToken,
              projectId,
              inspectionId,
              systemId,
              imageId,
              imagePath,
              i
            )
          }
        }

        // Delete Location
        await this.runDeleteInspectionLocations(
          accessToken,
          projectId,
          inspectionId
        )

        // Delete System
        await this.runDeleteInspectionSystems(
          accessToken,
          projectId,
          inspectionId
        )

        // Update Project Status
        await this.runDeleteInspectionUpdateStatus(
          accessToken,
          projectId,
          inspectionId
        )

        setTimeout(() => {
          this.getProjectDetail()
          this.getInspectionList()
          this.deleteInspection.dialog = false
          this.deleteInspection.loading = false
          this.deleteInspection.inspectionData = null
          this.deleteInspection.beforeDataLoading = false
          this.deleteInspection.location = []
          this.deleteInspection.locationDeflect = []
          this.deleteInspection.locationProgress = 0
          this.deleteInspection.system = []
          this.deleteInspection.systemDeflect = []
          this.deleteInspection.systemProgress = 0
          this.deleteInspection.reportDeleteDone = false
          this.deleteInspection.locationDeleteDone = false
          this.deleteInspection.systemDeleteDone = false
        }, 1000)
      }
    },

    async runDeleteInspectionReport(accessToken, projectId, inspectionId) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-report`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        this.deleteInspection.reportDeleteDone = true
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    async runMultipleDeleteLocationDeflect(
      accessToken,
      projectId,
      inspectionId,
      locationId,
      imageId,
      imagePath,
      index
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/location/deflect/single-delete`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
            location_id: locationId,
            image_id: imageId,
            image_path: imagePath,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        const progress =
          ((index + 1) / this.deleteInspection.locationDeflect.length) * 100
        this.deleteInspection.locationProgress = progress.toFixed(2)
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    async runMultipleDeleteSystemDeflect(
      accessToken,
      projectId,
      inspectionId,
      systemId,
      imageId,
      imagePath,
      index
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
            system_id: systemId,
            image_id: imageId,
            image_path: imagePath,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        const progress =
          ((index + 1) / this.deleteInspection.systemDeflect.length) * 100
        this.deleteInspection.systemProgress = progress.toFixed(2)
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    async runDeleteInspectionLocations(accessToken, projectId, inspectionId) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-locations`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        this.deleteInspection.locationDeleteDone = true
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    async runDeleteInspectionSystems(accessToken, projectId, inspectionId) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-systems`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        this.deleteInspection.systemDeleteDone = true
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    async runDeleteInspectionUpdateStatus(
      accessToken,
      projectId,
      inspectionId
    ) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/delete-update-status`,
          {
            project_id: projectId,
            inspection_id: inspectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        return true
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    async onCreateInspectionNote() {
      if (this.$refs.formCreateNote.validate()) {
        const accessToken = await this.getAccessToken()
        if (accessToken) {
          this.createInspectionNote.loading = true
          this.$axios
            .post(
              `${process.env.API_ENDPOINT}/v1/project/inspection/create-note`,
              {
                project_id: this.$route.query.id,
                inspection_id: this.createInspectionNote.data.inspection_id,
                note_title: this.createInspectionNote.title.trim(),
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then(() => {
              this.createInspectionNote.loading = false
              this.createInspectionNote.dialog = false
              this.getInspectionList()
            })
            .catch(() => {
              this.createInspectionNote.loading = false
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: 'รายการตรวจนี้ถูกลบไปแล้วกรุณาโหลดข้อมูลใหม่',
              })
            })
        }
      }
    },

    async onDeleteInspectionNote() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteInspectionNote.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/delete-note`,
            {
              project_id: this.$route.query.id,
              inspection_id: this.deleteInspectionNote.data.inspection_id,
              note_id: this.deleteInspectionNote.data.note_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            this.deleteInspectionNote.loading = false
            this.deleteInspectionNote.dialog = false
            this.getInspectionList()
          })
          .catch(() => {
            this.deleteInspectionNote.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: 'หมายเหตุนี้ถูกลบไปแล้วกรุณาโหลดข้อมูลใหม่',
            })
          })
      }
    },

    async onUpdateInspectionNote(item) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        const formattedMessage = item.edit_note_message.replace(/\n/g, '\n')
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/update-note`,
            {
              project_id: this.$route.query.id,
              inspection_id: item.inspection_id,
              note_id: item.note_id,
              note_title: item.edit_note_title.trim(),
              note_message: formattedMessage,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            this.getInspectionList()
          })
          .catch(() => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message: 'หมายเหตุนี้ถูกลบไปแล้วกรุณาโหลดข้อมูลใหม่',
            })
          })
      }
    },

    async moveLocationItemList(action, noteId, inspectionId) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/move-note`,
            {
              project_id: this.$route.query.id,
              inspection_id: inspectionId,
              type_action: action,
              note_id: noteId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            this.getInspectionList()
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'ดำเนินการไม่สำเร็จ',
              message: response,
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

.box-edit-note {
  display: flex;
  align-items: center;
  height: fit-content;
  border-radius: 4px;
  padding: 4px 0;
  transition: all ease 0.3s;
}

.box-edit-note:hover {
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

.cp-no-team-no-action {
  width: 300px;
  height: 55px;
  padding: 16px;
  margin: 16px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: default;
  color: var(--gray-500);
  border: 1px solid var(--gray-200);
  background-color: var(--gray-opacity-1);
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

textarea {
  border: 1px solid var(--gray-100);
  border-radius: 4px;
  width: 100%;
  padding: 12px;
  resize: none;
}

textarea:focus {
  outline: 2px solid var(--base-primary);
}
</style>
