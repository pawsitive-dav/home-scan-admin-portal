<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <div class="d-flex cp-text-description cp-subtitle cp-medium">
      <span class="mr-1" @click="$router.push('/projects/list')">
        <cp-link> รายการโปรเจค </cp-link>
      </span>
      /
      <span v-if="!systemDetail" class="mx-1 cp-text-disable">...</span>
      <span
        v-else
        class="mx-1"
        @click="
          $router.push(`/projects/list/detail?id=${systemDetail.project_id}`)
        "
      >
        <cp-link>
          {{ systemDetail ? systemDetail.project_name : '' }}
        </cp-link>
      </span>
      /
      <span v-if="!systemDetail" class="mx-1 cp-text-disable">...</span>
      <span
        v-else
        class="mx-1"
        @click="
          $router.push(
            `/projects/list/detail/inspection?id=${systemDetail.inspection_id}`
          )
        "
      >
        <cp-link>
          รายการตรวจที่
          {{ systemDetail ? systemDetail.inspection_no : '' }}
        </cp-link>
      </span>
      /
      <span v-if="!systemDetail" class="mx-1 cp-text-disable">...</span>
      <span v-else class="mx-1 cp-text-disable">
        {{ systemDetail ? systemDetail.system_name : '' }}
      </span>
    </div>

    <v-row v-if="!systemDetail" class="mt-4">
      <v-col cols="12">
        <v-sheet color="grey lighten-2" width="300" height="30" />
        <v-sheet color="grey lighten-2" width="500" height="20" class="mt-4" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col v-if="systemDetail" cols="12">
        <div class="d-flex align-center cp-header-2 cp-bold mb-2">
          <div class="mr-2">
            {{ systemDetail.system_name }}
          </div>
        </div>
        <div class="d-flex align-center">
          <b>รายการตรวจที่ {{ systemDetail.inspection_no }} - </b>
          <b class="ml-2">ของโปรเจค:</b>
          <span class="ml-1 cp-semibold">
            {{ systemDetail.project_name }}
          </span>
        </div>
      </v-col>

      <v-col cols="12">
        <cp-card class="pa-6">
          <div class="d-flex">
            <v-btn
              :disabled="!systemDetail"
              small
              outlined
              height="32"
              color="primary"
              @click="
                $router.push(
                  `/projects/list/detail/inspection?id=${systemDetail.inspection_id}&tab=system`
                )
              "
            >
              <v-icon left>mdi-arrow-left</v-icon>
              ย้อนกลับ
            </v-btn>
            <v-spacer />

            <div class="cp-subtitle">
              Deflect ทั้งหมด
              <b class="cp-title">{{ deflectList.length }}</b> รายการ
            </div>
          </div>
          <v-divider class="my-4" />

          <v-row v-if="systemDetail">
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-menu offset-y bottom right>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      elevation="0"
                      color="primary"
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon left>mdi-filter</v-icon>
                      กรองข้อมูล
                    </v-btn>
                  </template>
                  <v-list nav dense>
                    <v-list-item @click="onSortDeflect('pass')">
                      <span class="mr-3">เรียงข้อมูลจาก</span>
                      <b class="success--text">ผ่าน</b>
                      <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                      <b class="error--text">ไม่ผ่าน</b>
                    </v-list-item>
                    <v-list-item @click="onSortDeflect('not-pass')">
                      <span class="mr-3">เรียงข้อมูลจาก</span>
                      <b class="error--text">ไม่ผ่าน</b>
                      <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                      <b class="success--text">ผ่าน</b>
                    </v-list-item>
                    <v-list-item @click="onSortDeflect('new')">
                      <span class="mr-3">เรียงข้อมูลจาก</span>
                      <b>ล่าสุด</b>
                      <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                      <b>เก่าสุด</b>
                    </v-list-item>
                    <v-list-item @click="onSortDeflect('old')">
                      <span class="mr-3">เรียงข้อมูลจาก</span>
                      <b>เก่าสุด</b>
                      <v-icon small class="mx-2">mdi-arrow-right-thin</v-icon>
                      <b>ล่าสุด</b>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-spacer />
                <v-btn
                  v-if="selected.length > 0"
                  color="error"
                  height="36"
                  elevation="0"
                  class="mr-4"
                  @click="multipleDeleteDeflect.dialog = true"
                >
                  <div class="cp-text-capitalize">
                    <v-icon left>mdi-trash-can-outline</v-icon>
                    {{ selected.length }} Deflect
                  </div>
                </v-btn>

                <label
                  v-if="
                    systemDetail.report_status == 'in-progress' ||
                    systemDetail.report_status == null
                  "
                  class="custom-file-upload"
                >
                  <input
                    ref="imageInputRef"
                    type="file"
                    name="deflect"
                    accept="image/*"
                    multiple
                    @change="uploadImage"
                  />
                  <v-icon small left class="upload-icon">
                    mdi-file-image-plus-outline
                  </v-icon>
                  <div class="cp-caption">สร้าง Deflect</div>
                </label>
              </div>
            </v-col>
          </v-row>

          <v-data-table
            v-if="systemDetail"
            v-model="selected"
            :loading="tableLoading"
            :headers="headers"
            :items="deflectList"
            :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
            :show-select="
              systemDetail.report_status == 'in-progress' ||
              systemDetail.report_status == null
            "
            class="mt-6"
          >
            <template #item.image_path="{ item }">
              <v-img
                :src="item.image_path"
                aspect-ratio="1.4"
                class="my-4 grey lighten-2"
                min-width="150"
                contain
              >
                <div class="d-flex">
                  <v-spacer />
                  <v-btn
                    icon
                    color="white"
                    @click="onDonwloadImage(item.image_path, item.image_name)"
                  >
                    <v-icon>mdi-cloud-download-outline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="white"
                    @click="
                      ;(imagePreview.dialog = true),
                        (imagePreview.imageData = item)
                    "
                  >
                    <v-icon>mdi-arrow-expand-all</v-icon>
                  </v-btn>
                </div>
              </v-img>
            </template>

            <template #item.deflect_status="{ item }">
              <v-card min-width="210" color="transparent" class="d-flex" flat>
                <v-btn
                  v-if="
                    systemDetail.report_status == 'in-progress' ||
                    systemDetail.report_status == null
                  "
                  :color="
                    item.deflect_status === 0 || item.deflect_status === null
                      ? 'grey lighten-2'
                      : 'success'
                  "
                  elevation="0"
                  width="100"
                  class="rounded-0"
                  @click="
                    onUpdateDeflectStatus(
                      item.image_id,
                      1,
                      item.deflect_status
                    ),
                      (item.deflect_status = 1)
                  "
                >
                  <div class="cp-body">ผ่าน</div>
                </v-btn>
                <v-sheet
                  v-else
                  :color="
                    item.deflect_status === 0 || item.deflect_status === null
                      ? 'grey lighten-2'
                      : 'success'
                  "
                  width="100"
                  height="36"
                  class="d-flex align-center justify-center"
                >
                  <div
                    v-if="
                      item.deflect_status === 0 || item.deflect_status === null
                    "
                    class="cp-body"
                  >
                    ผ่าน
                  </div>
                  <div v-else class="cp-body white--text">ผ่าน</div>
                </v-sheet>

                <v-btn
                  v-if="
                    systemDetail.report_status == 'in-progress' ||
                    systemDetail.report_status == null
                  "
                  :color="
                    item.deflect_status === 1 || item.deflect_status === null
                      ? 'grey lighten-2'
                      : 'error'
                  "
                  elevation="0"
                  width="100"
                  class="rounded-0"
                  @click="
                    onUpdateDeflectStatus(
                      item.image_id,
                      0,
                      item.deflect_status
                    ),
                      (item.deflect_status = 0)
                  "
                >
                  <div class="cp-body">ไม่ผ่าน</div>
                </v-btn>
                <v-sheet
                  v-else
                  :color="
                    item.deflect_status === 1 || item.deflect_status === null
                      ? 'grey lighten-2'
                      : 'error'
                  "
                  width="100"
                  height="36"
                  class="d-flex align-center justify-center"
                >
                  <div
                    v-if="
                      item.deflect_status === 1 || item.deflect_status === null
                    "
                    class="cp-body"
                  >
                    ไม่ผ่าน
                  </div>
                  <div v-else class="cp-body white--text">ไม่ผ่าน</div>
                </v-sheet>
              </v-card>
            </template>

            <template #item.deflect_detail="{ item }">
              <v-card min-width="150" max-width="150" color="transparent" flat>
                <p v-if="item.deflect_detail">{{ item.deflect_detail }}</p>
                <p v-else class="cp-text-disable">ยังไม่มีรายละเอียด</p>
              </v-card>
            </template>

            <template #item.created_at="{ item }">
              <v-card max-width="130" min-width="130" color="transparent" flat>
                <div>
                  {{ item.created_by.code_name }}
                </div>
                <div>
                  {{ formatDateShot(item.created_at) }}
                </div>
              </v-card>
            </template>

            <template #item.update_status_at="{ item }">
              <v-card max-width="130" min-width="130" color="transparent" flat>
                <div>
                  {{ item.update_status_by.code_name }}
                </div>
                <div>
                  {{ formatDateShot(item.update_status_at) }}
                </div>
              </v-card>
            </template>

            <template #item.actions="{ item }">
              <cp-col min="100">
                <v-icon
                  v-if="
                    systemDetail.report_status == 'in-progress' ||
                    systemDetail.report_status == null
                  "
                  small
                  class="mr-2"
                  @click="
                    ;(editDetail.dialog = true),
                      (editDetail.data = item),
                      (editDetail.newDetail = item.deflect_detail)
                  "
                >
                  mdi-pencil-outline
                </v-icon>
                <v-icon v-else small disabled class="mr-2">
                  mdi-pencil-off-outline
                </v-icon>
                <v-icon
                  v-if="
                    systemDetail.report_status == 'in-progress' ||
                    systemDetail.report_status == null
                  "
                  small
                  class="cp-vbtn-error ml-4"
                  @click="
                    ;(deleteDeflect.dialog = true),
                      (deleteDeflect.deflectData = item)
                  "
                >
                  mdi-trash-can-outline
                </v-icon>
                <v-icon v-else small disabled class="ml-4">
                  mdi-delete-off-outline
                </v-icon>
              </cp-col>
            </template>

            <template #no-data>
              <div class="cp-text-disable">ไม่มีรายการ Deflect</div>
            </template>
          </v-data-table>
        </cp-card>
      </v-col>
    </v-row>

    <!-- Modal -->
    <!-- Image Preview -->
    <v-dialog
      v-model="imagePreview.dialog"
      :persistent="imagePreview.loading"
      scrollable
      width="800"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card v-if="imagePreview.imageData">
        <v-card-title>
          <div v-if="imagePreview.imageData.image_name">
            {{ imagePreview.imageData.image_name }}
          </div>
          <div v-else class="cp-text-disable">ไม่มีชื่อรูป</div>
          <v-spacer />
          <v-btn icon class="mt-n4 mr-n4" @click="imagePreview.dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-sheet color="grey lighten-3">
            <v-img
              :src="imagePreview.imageData.image_path"
              width="100%"
              aspect-ratio="1.4"
              contain
            ></v-img>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Create Deflect Progress -->
    <v-dialog
      v-model="createDeflectProgress.dialog"
      persistent
      max-width="500px"
      transition="dialog-transition"
      content-class="elevation-0"
    >
      <v-card>
        <v-card-title> ระบบกำลังดำเนินการ </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3"> สร้าง Deflect </v-col>
            <v-col cols="9">
              <v-progress-linear
                v-model="createDeflectProgress.createDeflect"
                color="info"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ createDeflectProgress.createDeflect }}%
                </strong>
              </v-progress-linear>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Single Deflect -->
    <v-dialog
      v-model="deleteDeflect.dialog"
      :persistent="deleteDeflect.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Deflect
          <v-spacer />
          <v-btn
            :disabled="deleteDeflect.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteDeflect.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่คุณจะลบ Deflect นี้?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteDeflect.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onSingleDeleteDeflect()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete multiple Deflect -->
    <v-dialog
      v-model="multipleDeleteDeflect.dialog"
      :persistent="multipleDeleteDeflect.loading"
      max-width="450px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          ลบ Deflect หลายรายการ
          <v-spacer />
          <v-btn
            :disabled="multipleDeleteDeflect.loading"
            icon
            class="mt-n4 mr-n4"
            @click="multipleDeleteDeflect.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="!multipleDeleteDeflect.loading">
            ยืนยันการลบ Deflect
            {{ selected.length }} รายการ
          </div>
          <v-row v-else>
            <v-col cols="3"> ดำเนินการลบ </v-col>
            <v-col cols="9">
              <v-progress-linear
                v-model="multipleDeleteDeflect.deleteProgress"
                color="primary"
                height="20"
                rounded
              >
                <strong class="white--text">
                  {{ multipleDeleteDeflect.deleteProgress }}%
                </strong>
              </v-progress-linear>
            </v-col>
          </v-row>

          <div
            v-if="!multipleDeleteDeflect.loading"
            class="mt-6 d-flex flex-row-reverse"
          >
            <v-btn
              :loading="multipleDeleteDeflect.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onMultipleDeleteDeflect()"
            >
              <div class="cp-text-capitalize">ยืนยัน</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Deflect Detail -->
    <v-dialog
      v-model="editDetail.dialog"
      :persistent="editDetail.loading"
      transition="dialog-transition"
      content-class="elevation-0"
      width="400"
      scrollable
    >
      <v-card>
        <v-card-title>
          <div>แก้ไข รายละเอียด</div>
          <v-spacer />
          <v-btn
            :disabled="editDetail.loading"
            icon
            class="mt-n4 mr-n4"
            @click="editDetail.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <cp-label>รายละเอียด</cp-label>
          <v-textarea
            v-model="editDetail.newDetail"
            auto-grow
            outlined
            dense
            rows="1"
            counter="50"
            maxlength="50"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="py-4">
          <v-spacer />
          <v-btn
            :loading="editDetail.loading"
            elevation="0"
            height="36"
            color="primary"
            class="px-4"
            @click="onSaveDeflectDetail()"
          >
            <div class="cp-text-capitalize">ยืนยันการแก้ไข</div>
          </v-btn>
        </v-card-actions>
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
      selected: [],
      headers: [
        { text: 'Deflect', sortable: false, value: 'image_path' },
        { text: 'สถานะ', sortable: false, value: 'deflect_status' },
        { text: 'รายละเอียด', sortable: false, value: 'deflect_detail' },
        { text: 'สร้างโดย', sortable: false, value: 'created_at' },
        { text: 'บันทึกสถานะ', sortable: false, value: 'update_status_at' },
        { text: 'ดำเนินการ', sortable: false, value: 'actions' },
      ],
      systemDetail: null,
      tableLoading: false,
      deflectList: [],
      imagePreview: {
        dialog: false,
        imageData: null,
      },
      imageGroup: [],
      deflectPreCreate: [],
      createDeflectProgress: {
        dialog: false,
        preImageFalse: false,
        uploadImage: 0,
        createDeflect: 0,
      },
      deleteDeflect: {
        mode: false,
        loading: false,
        dialog: false,
        deflectData: null,
      },
      multipleDeleteDeflect: {
        mode: false,
        loading: false,
        dialog: false,
        deflectDataList: [],
        deleteProgress: 0,
      },
      editDetail: {
        dialog: false,
        loading: false,
        data: null,
        newDetail: '',
      },
    }
  },

  head: {
    title: 'system Deflect',
  },

  computed: {
    ...mapState('user', ['role', 'appRoleList']),
  },

  watch: {
    'editDetail.dialog'(newValue) {
      if (!newValue) {
        this.editDetail.data = null
        this.editDetail.newDetail = ''
      }
    },
  },

  created() {
    this.onGetSystemDetail()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),

    formatDate(dateStr) {
      const result = moment(dateStr).locale('th').format('DD/MMMM/yyyy')
      return result
    },

    formatDateMax(dateStr) {
      if (dateStr) {
        const result = moment(dateStr)
          .locale('th')
          .format('DD/MMMM/yyyy เวลา HH:mm')
        return result
      } else {
        return '-'
      }
    },

    formatDateShot(dateStr) {
      if (dateStr) {
        const result = moment(dateStr).locale('th').format('DD MMM YY - HH:mm')
        return result
      } else {
        return '-'
      }
    },

    mapRoleName(level) {
      const role = this.appRoleList.find((role) => role.role_level === level)
      return role ? role.role_name : null
    },

    async onGetSystemDetail() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        try {
          const { data } = await this.$axios.post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/detail`,
            {
              system_id: this.$route.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          this.systemDetail = data.data
          this.onGetDeflectList()
        } catch ({ response }) {
          this.systemDetail = false
          this.onNotify({
            notifyValue: true,
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            message:
              'ไม่พบข้อมูล System กรุณาลองใหม่อีกครั้ง หรือรายการตรวจอาจถูกลบจากผู้ใช้งานท่านอื่น',
          })
        }
      }
    },

    async onGetDeflectList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.tableLoading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/list`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            if (data.data) {
              this.deflectList = []
              data.data.forEach((element) => {
                element.deflect_detail = element.deflect_detail || ''
                element.deflect_detail_new = element.deflect_detail
                element.deleteSelect = false
                this.deflectList.push(element)
              })
              this.deflectList.sort((a, b) => a.id - b.id)
              this.tableLoading = false
            }
          })
          .catch((error) => {
            this.tableLoading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'ดำเนินการไม่สำเร็จ',
              message: error,
            })
          })
      }
    },

    processImageFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const imageName = file.name.replace(/\s/g, '-').replace(/\..*$/, '')
          resolve({
            image: reader.result,
            name: imageName,
          })
        }
        reader.readAsDataURL(file)
      })
    },

    cropImage(imageDataUrl, targetWidth, targetHeight) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const aspectRatio = targetWidth / targetHeight

          let newWidth, newHeight

          if (img.width / img.height > aspectRatio) {
            newHeight = img.height
            newWidth = img.height * aspectRatio
          } else {
            newWidth = img.width
            newHeight = img.width / aspectRatio
          }

          const startX = (img.width - newWidth) / 2
          const startY = (img.height - newHeight) / 2

          canvas.width = targetWidth
          canvas.height = targetHeight

          ctx.drawImage(
            img,
            startX,
            startY,
            newWidth,
            newHeight,
            0,
            0,
            targetWidth,
            targetHeight
          )

          const croppedImageDataUrl = canvas.toDataURL('image/jpeg')
          resolve(croppedImageDataUrl)
        }

        img.src = imageDataUrl
      })
    },

    async uploadImage(event) {
      await this.onGetSystemDetail()
      if (this.systemDetail) {
        const files = event.target.files
        if (files.length > 0) {
          const accessToken = await this.getAccessToken()
          if (accessToken) {
            this.createDeflectProgress.dialog = true
            for (let index = 0; index < files.length; index++) {
              const processedImage = await this.processImageFile(files[index])
              const croppedImage = await this.cropImage(
                processedImage.image,
                1000,
                715
              )
              const fileImage = {
                image: croppedImage,
                name: processedImage.name,
                size: files[index].size,
              }
              await this.onCreateDeflectV2(
                accessToken,
                fileImage,
                index,
                files.length
              )
            }
            this.$refs.imageInputRef.value = null
            this.onGetDeflectList()
            setTimeout(() => {
              this.createDeflectProgress.dialog = false
              this.createDeflectProgress.createDeflect = 0
            }, 1000)
          }
        }
      }
    },

    async onCreateDeflectV2(accessToken, fileImage, index, fileLength) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v2/project/inspection/system/deflect/create`,
          {
            project_id: this.systemDetail.project_id,
            inspection_id: this.systemDetail.inspection_id,
            system_id: this.systemDetail.system_id,
            file_image: fileImage,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        const progress = ((index + 1) / fileLength) * 100
        this.createDeflectProgress.createDeflect = progress.toFixed(2)
      } catch ({ response }) {
        this.handleUploadError(response.data)
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

    onUpdateDeflectStatus(imageId, status, statusNow) {
      if (statusNow === null) {
        this.runUpdateDeflectStatus(imageId, status)
      } else if (Number(status) !== Number(statusNow)) {
        this.runUpdateDeflectStatus(imageId, status)
      }
    },

    async runUpdateDeflectStatus(imageId, status) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/status`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
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
            this.onGetDeflectList()
          })
          .catch(({ response }) => {
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'ดำเนินการไม่สำเร็จ',
              message:
                'ไม่สามารถบันทึกสาถานะได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบ Deflect นี้แล้ว',
            })
          })
      }
    },

    async onSaveDeflectDetail() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.editDetail.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/detail`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: this.editDetail.data.image_id,
              deflect_detail: this.editDetail.newDetail.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.onGetDeflectList()
            this.editDetail.loading = false
            this.editDetail.dialog = false
          })
          .catch(({ response }) => {
            this.editDetail.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message:
                'ไม่สามารถบันทึกรายละเอียดได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบ Deflect นี้แล้ว',
            })
          })
      }
    },

    async onDonwloadImage(imageUrl, fileName) {
      const base64String = await this.getImageBase64(imageUrl)
      if (base64String) {
        const a = document.createElement('a')
        a.href = base64String.image
        a.download = fileName || 'no-name' + '.jpeg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
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
              page_focus: 'inspection',
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

    async onSingleDeleteDeflect() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteDeflect.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
            {
              project_id: this.systemDetail.project_id,
              inspection_id: this.systemDetail.inspection_id,
              system_id: this.systemDetail.system_id,
              image_id: this.deleteDeflect.deflectData.image_id,
              image_path: this.deleteDeflect.deflectData.image_path,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteDeflect.loading = false
            this.deleteDeflect.dialog = false
            this.onGetDeflectList()
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'ดำเนินการสำเร็จ',
              message: 'Deflect ถูกลบสำเร็จแล้ว',
            })
          })
          .catch(({ response }) => {
            this.deleteDeflect.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
              message:
                'ไม่สามารถลบ Deflect นี้ได้กรุณาลองใหม่อีกครั้ง หรือมีผู้ใช้งานท่านอื่นลบ Deflect นี้แล้ว',
            })
          })
      }
    },

    onSelectedDeleteDeflect(item) {
      if (this.multipleDeleteDeflect.mode) {
        item.deleteSelect = !item.deleteSelect

        if (item.deleteSelect) {
          this.multipleDeleteDeflect.deflectDataList.push(item)
        } else {
          this.multipleDeleteDeflect.deflectDataList =
            this.multipleDeleteDeflect.deflectDataList.filter(
              (key) => key.id !== item.id
            )
        }
      }
    },

    async onMultipleDeleteDeflect() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.multipleDeleteDeflect.loading = true
        for (let i = 0; i < this.selected.length; i++) {
          const imageId = this.selected[i].image_id
          const imagePath = this.selected[i].image_path
          await this.runMultipleDeleteDeflect(
            accessToken,
            imageId,
            imagePath,
            i
          )
        }

        setTimeout(() => {
          this.multipleDeleteDeflect.loading = false
          this.multipleDeleteDeflect.dialog = false
          this.multipleDeleteDeflect.deleteProgress = 0
          this.selected = []
          this.onGetDeflectList()
          this.onNotify({
            notifyValue: true,
            type: 'success',
            title: 'ดำเนินการสำเร็จ',
            message: 'รายการ Deflect ถูกลบสำเร็จแล้ว',
          })
        }, 1000)
      }
    },

    async runMultipleDeleteDeflect(accessToken, imageId, imagePath, index) {
      try {
        await this.$axios.post(
          `${process.env.API_ENDPOINT}/v1/project/inspection/system/deflect/single-delete`,
          {
            project_id: this.systemDetail.project_id,
            inspection_id: this.systemDetail.inspection_id,
            system_id: this.systemDetail.system_id,
            image_id: imageId,
            image_path: imagePath,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        const progress = ((index + 1) / this.selected.length) * 100
        this.multipleDeleteDeflect.deleteProgress = progress.toFixed(2)
      } catch ({ response }) {
        this.handleUploadError(response.data)
      }
    },

    onSortDeflect(action) {
      switch (action) {
        case 'pass':
          this.deflectList.sort((a, b) => b.deflect_status - a.deflect_status)
          break
        case 'not-pass':
          this.deflectList.sort((a, b) => a.deflect_status - b.deflect_status)
          break
        case 'new':
          this.deflectList.sort((a, b) => b.id - a.id)
          break
        case 'old':
          this.deflectList.sort((a, b) => a.id - b.id)
          break
        default:
          console.error('Unknown action:', action)
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
.cp-no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: var(--gray-opacity-1);
  color: var(--gray-500);
}
.cp-vbtn-error {
  transition: all ease 0.3s;
}
.cp-vbtn-error:hover {
  background-color: var(--red-opacity-1);
  color: var(--base-error);
}
input[type='file'] {
  display: none;
}
.custom-file-upload {
  flex: 1;
  max-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  cursor: pointer;
  padding: 0 16px;
  border-radius: 4px;
  color: var(--base-light);
  background-color: var(--base-primary);
  transition: all ease 0.3s;
}
.custom-file-upload .upload-icon {
  color: var(--base-light);
}
.custom-file-upload:hover {
  background-color: var(--deep-blue-400);
}
</style>
