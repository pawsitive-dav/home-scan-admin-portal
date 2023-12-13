<template>
  <div>
    <div class="cp-text-description cp-title cp-medium">
      <a @click="$router.push('/projects/list')">รายการโปรเจค</a>
      / สร้างโปรเจค
    </div>

    <v-form ref="formCreate" v-model="valid" lazy-validation>
      <v-row class="mt-2">
        <v-col cols="12" sm="8" md="8" lg="8">
          <cp-card class="pa-6">
            <div class="cp-title pb-5">ข้อมูลโปรเจค</div>
            <v-row>
              <v-col cols="12" md="6">
                <cp-label>
                  ชื่อโปรเจค <span class="error--text">(จำเป็น)</span>
                </cp-label>
                <v-text-field
                  v-model="projectDetail.name"
                  :rules="projectDetail.nameRules"
                  :disabled="loading"
                  dense
                  outlined
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <cp-label>
                  ประเภทโปรเจค
                  <span class="error--text">(จำเป็น)</span>
                </cp-label>
                <v-select
                  v-model="projectDetail.typeValue"
                  :items="projectDetail.typeItems"
                  :rules="projectDetail.typeRules"
                  :disabled="loading"
                  item-text="type_name"
                  item-value="type_name"
                  dense
                  outlined
                  required
                />
              </v-col>

              <v-col cols="12">
                <cp-label>
                  หมายเหตุ: บอกทีมหน้างาน
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-textarea
                  v-model="projectDetail.description"
                  :disabled="loading"
                  counter="250"
                  maxlength="250"
                  rows="3"
                  outlined
                  auto-grow
                />
              </v-col>

              <v-col cols="12">
                <div class="cp-title">
                  รายละเอียด
                  {{
                    projectDetail.typeValue
                      ? mapTypeName(projectDetail.typeValue)
                      : ''
                  }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <cp-label>
                  เลขที่
                  {{
                    projectDetail.typeValue
                      ? mapTypeName(projectDetail.typeValue)
                      : ''
                  }}
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="typeDetail.address"
                  :rules="typeDetail.addressRules"
                  :disabled="loading"
                  dense
                  outlined
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <cp-label>
                  พื้นที่ใช้สอย
                  {{
                    projectDetail.typeValue
                      ? mapTypeName(projectDetail.typeValue)
                      : ''
                  }}
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="typeDetail.usableArea"
                  :disabled="loading"
                  :rules="typeDetail.usableAreaRules"
                  suffix="ตร.ม."
                  dense
                  outlined
                  @blur="unfocusUsableArea()"
                />
              </v-col>

              <v-col cols="12">
                <div class="cp-title pb-4">
                  ไฟล์ภาพที่เกี่ยวข้อง
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </div>
                <v-row>
                  <v-col cols="12">
                    <input
                      ref="imageInput"
                      type="file"
                      style="display: none"
                      accept="image/*"
                      @change="uploadImage"
                    />
                    <cp-label>
                      รูปโปรเจค
                      {{
                        projectDetail.typeValue
                          ? mapTypeName(projectDetail.typeValue)
                          : ''
                      }}
                    </cp-label>
                    <div
                      v-if="loading && !fileSelect.typeImagePreview"
                      class="file-card-upload-main-disable"
                    >
                      <div class="text-center">
                        <v-icon size="32" color="grey lighten-2">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="!fileSelect.typeImagePreview"
                      class="file-card-upload-main"
                      @click="openImageInput(), (fileOption = 'typeImage')"
                    >
                      <div class="text-center">
                        <v-icon size="32" class="upload-icon">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="fileSelect.typeImagePreview"
                      class="file-card-show"
                    >
                      <div class="image-zone">
                        <v-img
                          :src="fileSelect.typeImagePreview"
                          aspect-ratio="1.4"
                        />
                      </div>
                      <div class="pt-2 d-flex justify-end">
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="primary"
                          @click="openImageInput(), (fileOption = 'typeImage')"
                        >
                          เปลี่ยนรูป
                        </v-btn>
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="error"
                          class="ml-2"
                          @click="fileSelect.typeImagePreview = ''"
                        >
                          ลบ
                        </v-btn>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <cp-label>
                      แปลนที่ 1
                      {{
                        projectDetail.typeValue
                          ? mapTypeName(projectDetail.typeValue)
                          : ''
                      }}
                    </cp-label>
                    <div
                      v-if="loading && !fileSelect.typePlan1Preview"
                      class="file-card-upload-disable"
                    >
                      <div class="text-center">
                        <v-icon size="32" color="grey lighten-2">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="!fileSelect.typePlan1Preview"
                      class="file-card-upload"
                      @click="openImageInput(), (fileOption = 'typePlan1')"
                    >
                      <div class="text-center">
                        <v-icon size="32" class="upload-icon">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="fileSelect.typePlan1Preview"
                      class="file-card-show"
                    >
                      <div class="image-zone">
                        <v-img
                          :src="fileSelect.typePlan1Preview"
                          aspect-ratio="1.4"
                          contain
                        />
                      </div>
                      <div class="pt-2 d-flex justify-end">
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="primary"
                          @click="openImageInput(), (fileOption = 'typePlan1')"
                        >
                          เปลี่ยนรูป
                        </v-btn>
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="error"
                          class="ml-2"
                          @click="
                            ;(fileSelect.typePlan1Preview = ''),
                              (fileSelect.typePlan1Preview =
                                fileSelect.typePlan2Preview),
                              (fileSelect.typePlan2Preview =
                                fileSelect.typePlan3Preview),
                              (fileSelect.typePlan3Preview =
                                fileSelect.typePlan4Preview),
                              (fileSelect.typePlan4Preview = '')
                          "
                        >
                          ลบ
                        </v-btn>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <cp-label>
                      แปลนที่ 2
                      {{
                        projectDetail.typeValue
                          ? mapTypeName(projectDetail.typeValue)
                          : ''
                      }}
                    </cp-label>
                    <div
                      v-if="
                        (loading && !fileSelect.typePlan2Preview) ||
                        !fileSelect.typePlan1Preview
                      "
                      class="file-card-upload-disable"
                    >
                      <div class="text-center">
                        <v-icon size="32" color="grey lighten-2">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div v-if="!fileSelect.typePlan1Preview">
                          อัพโหลดแปลน 1 ก่อน
                        </div>
                        <div v-else>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="!fileSelect.typePlan2Preview"
                      class="file-card-upload"
                      @click="openImageInput(), (fileOption = 'typePlan2')"
                    >
                      <div class="text-center">
                        <v-icon size="32" class="upload-icon">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="fileSelect.typePlan2Preview"
                      class="file-card-show"
                    >
                      <div class="image-zone">
                        <v-img
                          :src="fileSelect.typePlan2Preview"
                          aspect-ratio="1.4"
                          contain
                        />
                      </div>
                      <div class="pt-2 d-flex justify-end">
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="primary"
                          @click="openImageInput(), (fileOption = 'typePlan2')"
                        >
                          เปลี่ยนรูป
                        </v-btn>
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="error"
                          class="ml-2"
                          @click="
                            ;(fileSelect.typePlan2Preview = ''),
                              (fileSelect.typePlan2Preview =
                                fileSelect.typePlan3Preview),
                              (fileSelect.typePlan3Preview =
                                fileSelect.typePlan4Preview),
                              (fileSelect.typePlan4Preview = '')
                          "
                        >
                          ลบ
                        </v-btn>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <cp-label>
                      แปลนที่ 3
                      {{
                        projectDetail.typeValue
                          ? mapTypeName(projectDetail.typeValue)
                          : ''
                      }}
                    </cp-label>
                    <div
                      v-if="
                        (loading && !fileSelect.typePlan3Preview) ||
                        !fileSelect.typePlan2Preview
                      "
                      class="file-card-upload-disable"
                    >
                      <div class="text-center">
                        <v-icon size="32" color="grey lighten-2">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div v-if="!fileSelect.typePlan2Preview">
                          อัพโหลดแปลน 2 ก่อน
                        </div>
                        <div v-else>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="!fileSelect.typePlan3Preview"
                      class="file-card-upload"
                      @click="openImageInput(), (fileOption = 'typePlan3')"
                    >
                      <div class="text-center">
                        <v-icon size="32" class="upload-icon">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="fileSelect.typePlan3Preview"
                      class="file-card-show"
                    >
                      <div class="image-zone">
                        <v-img
                          :src="fileSelect.typePlan3Preview"
                          aspect-ratio="1.4"
                          contain
                        />
                      </div>
                      <div class="pt-2 d-flex justify-end">
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="primary"
                          @click="openImageInput(), (fileOption = 'typePlan3')"
                        >
                          เปลี่ยนรูป
                        </v-btn>
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="error"
                          class="ml-2"
                          @click="
                            ;(fileSelect.typePlan3Preview = ''),
                              (fileSelect.typePlan3Preview =
                                fileSelect.typePlan4Preview),
                              (fileSelect.typePlan4Preview = '')
                          "
                        >
                          ลบ
                        </v-btn>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <cp-label>
                      แปลนที่ 4
                      {{
                        projectDetail.typeValue
                          ? mapTypeName(projectDetail.typeValue)
                          : ''
                      }}
                    </cp-label>
                    <div
                      v-if="
                        (loading && !fileSelect.typePlan4Preview) ||
                        !fileSelect.typePlan3Preview
                      "
                      class="file-card-upload-disable"
                    >
                      <div class="text-center">
                        <v-icon size="32" color="grey lighten-2">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div v-if="!fileSelect.typePlan3Preview">
                          อัพโหลดแปลน 3 ก่อน
                        </div>
                        <div v-else>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="!fileSelect.typePlan4Preview"
                      class="file-card-upload"
                      @click="openImageInput(), (fileOption = 'typePlan4')"
                    >
                      <div class="text-center">
                        <v-icon size="32" class="upload-icon">
                          mdi-cloud-upload-outline
                        </v-icon>
                        <div>อัพโหลดรูป</div>
                      </div>
                    </div>
                    <div
                      v-else-if="fileSelect.typePlan4Preview"
                      class="file-card-show"
                    >
                      <div class="image-zone">
                        <v-img
                          :src="fileSelect.typePlan4Preview"
                          aspect-ratio="1.4"
                          contain
                        />
                      </div>
                      <div class="pt-2 d-flex justify-end">
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="primary"
                          @click="openImageInput(), (fileOption = 'typePlan4')"
                        >
                          เปลี่ยนรูป
                        </v-btn>
                        <v-btn
                          :disabled="loading"
                          small
                          outlined
                          elevation="0"
                          color="error"
                          class="ml-2"
                          @click="fileSelect.typePlan4Preview = ''"
                        >
                          ลบ
                        </v-btn>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="d-flex">
              <v-spacer />
              <v-btn
                :disabled="loading"
                elevation="0"
                height="36"
                color="gray"
                class="mr-4"
                @click="$router.push('/projects/list')"
              >
                <div class="cp-text-capitalize">ยกเลิก</div>
              </v-btn>
              <v-btn
                :loading="loading"
                :disabled="!valid"
                elevation="0"
                height="36"
                color="primary"
                @click="validationCreate()"
              >
                <div class="cp-text-capitalize">สร้างโปรเจค</div>
              </v-btn>
            </div>
          </cp-card>
        </v-col>

        <v-col cols="12" sm="4" md="4" lg="4">
          <v-row>
            <v-col cols="12">
              <cp-card class="pa-6">
                <div class="cp-title pb-4">ข้อมูลลูกค้า</div>
                <cp-label>
                  ชื่อลูกค้า
                  <span class="error--text">(จำเป็น)</span>
                </cp-label>
                <v-text-field
                  v-model="customerDetail.name"
                  :rules="customerDetail.nameRules"
                  :disabled="loading"
                  dense
                  outlined
                  required
                />
                <cp-label>
                  เบอร์โทรศัพท์
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="customerDetail.mobileNumber"
                  :disabled="loading"
                  :rules="customerDetail.mobileNumberRules"
                  maxlength="10"
                  counter="10"
                  dense
                  outlined
                  required
                />
                <cp-label>
                  อีเมล
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="customerDetail.email"
                  :rules="customerDetail.emailRules"
                  :disabled="loading"
                  dense
                  outlined
                  required
                />
              </cp-card>
            </v-col>

            <v-col cols="12">
              <cp-card class="pa-6">
                <div class="cp-title pb-4">ข้อมูลเจ้าหน้าที่โครงการ</div>
                <cp-label>
                  ชื่อเจ้าหน้าที่
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="projectCoordinator.name"
                  :rules="projectCoordinator.nameRules"
                  :disabled="loading"
                  dense
                  outlined
                  required
                />
                <cp-label>
                  เบอร์โทรศัพท์
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="projectCoordinator.mobileNumber"
                  :disabled="loading"
                  :rules="projectCoordinator.mobileNumberRules"
                  maxlength="10"
                  counter="10"
                  dense
                  outlined
                  required
                />
                <cp-label>
                  อีเมล
                  <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                </cp-label>
                <v-text-field
                  v-model="projectCoordinator.email"
                  :rules="projectCoordinator.emailRules"
                  :disabled="loading"
                  dense
                  outlined
                  required
                />
              </cp-card>
            </v-col>

            <v-col cols="12">
              <cp-card class="pa-6">
                <div class="cp-title pb-4">ทีมงานในโปรเจค</div>
                <v-card outlined class="px-4 py-2">
                  <cp-label> เจ้าของโปรเจค </cp-label>
                  <div class="d-flex align-center">
                    <v-avatar size="45" color="primary">
                      <img v-if="avatarPath" :src="avatarPath" />
                      <v-img
                        v-else
                        :src="require('@/assets/images/no-avatar.png')"
                      />
                    </v-avatar>
                    <div class="pl-4">
                      <div class="truncate cp-semibold">
                        {{ codeName }}
                      </div>
                      <div class="truncate cp-text-description cp-caption">
                        {{ firstName + ' ' + lastName }}
                      </div>
                      <div class="cp-caption green--text">
                        <span>{{ role }}</span>
                      </div>
                    </div>
                  </div>
                </v-card>

                <v-card outlined class="px-4 py-2 mt-4">
                  <cp-label>
                    หัวหน้าทีมตรวจ
                    <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                  </cp-label>
                  <div
                    v-if="projectTeam.checkerSupervisor"
                    class="d-flex align-center justify-space-between"
                  >
                    <v-avatar size="45" color="primary">
                      <img
                        v-if="projectTeam.checkerSupervisor.avatar_path"
                        :src="projectTeam.checkerSupervisor.avatar_path"
                      />
                      <v-img
                        v-else
                        :src="require('@/assets/images/no-avatar.png')"
                      />
                    </v-avatar>
                    <div class="cp-team">
                      <div class="truncate cp-semibold">
                        {{ projectTeam.checkerSupervisor.code_name }}
                      </div>
                      <div class="truncate cp-text-description cp-caption">
                        {{
                          projectTeam.checkerSupervisor.first_name +
                          ' ' +
                          projectTeam.checkerSupervisor.last_name
                        }}
                      </div>
                      <div class="cp-caption green--text">
                        <span>{{
                          mapRoleName(projectTeam.checkerSupervisor.member_role)
                        }}</span>
                      </div>
                    </div>
                    <div v-if="loading">
                      <v-icon :disabled="loading" class="cp-team-disable-icon">
                        mdi-trash-can-outline
                      </v-icon>
                    </div>
                    <div v-else class="cp-team-remove">
                      <v-icon
                        :disabled="loading"
                        class="cp-team-remove-icon"
                        @click="removeTeam(projectTeam.checkerSupervisor, 0)"
                      >
                        mdi-trash-can-outline
                      </v-icon>
                    </div>
                  </div>
                  <v-menu v-else bottom right>
                    <template #activator="{ on, attrs }">
                      <div v-if="loading" class="checker-add-disable">
                        <v-icon color="grey lighten-1">mdi-plus</v-icon>
                      </div>
                      <div
                        v-else
                        class="cp-btn-add"
                        v-bind="attrs"
                        v-on="on"
                        @click="getMemberByRole()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </div>
                    </template>
                    <div
                      v-if="projectTeam.checkerList.length !== 0"
                      class="cp-subheader"
                    >
                      เลือกทีมงาน
                    </div>
                    <div class="cp-menu">
                      <v-list
                        v-if="projectTeam.checkerList.length === 0"
                        width="280"
                        nav
                        dense
                      >
                        <v-list-item>
                          <v-list-item-avatar color="grey lighten-2">
                            <v-icon color="grey">
                              mdi-account-remove-outline
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <div class="cp-semobold">ไม่มีข้อมูล</div>
                            <div class="cp-overline cp-text-description">
                              ไม่มีรายการทีมงานเหลือแล้ว
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <v-list v-else width="280" nav dense>
                        <v-list-item
                          v-for="(item, index) in projectTeam.checkerList"
                          :key="index + 'checkerList-supervisor'"
                          @click="onAddTeam(item, 0)"
                        >
                          <v-list-item-avatar color="primary">
                            <img
                              v-if="item.avatar_path"
                              :src="item.avatar_path"
                            />
                            <v-img
                              v-else
                              :src="require('@/assets/images/no-avatar.png')"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <div class="cp-semobold">
                              {{ item.code_name }}
                            </div>
                            <div class="cp-overline cp-text-description">
                              {{ item.first_name + ' ' + item.last_name }}
                            </div>
                            <div class="cp-overline green--text">
                              {{ mapRoleName(item.member_role) }}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-menu>
                </v-card>

                <v-card outlined class="px-4 py-2 mt-4">
                  <cp-label>
                    ทีมตรวจ
                    <span class="cp-text-disable">(เพิ่มภายหลังได้)</span>
                  </cp-label>
                  <v-menu bottom right>
                    <template #activator="{ on, attrs }">
                      <div v-if="loading" class="checker-add-disable">
                        <v-icon color="grey lighten-1">mdi-plus</v-icon>
                      </div>
                      <div
                        v-else
                        class="checker-add"
                        v-bind="attrs"
                        v-on="on"
                        @click="getMemberByRole()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </div>
                    </template>
                    <div
                      v-if="projectTeam.checkerList.length !== 0"
                      class="cp-subheader"
                    >
                      เลือกทีมงาน
                    </div>

                    <div class="cp-menu">
                      <v-list
                        v-if="projectTeam.checkerList.length === 0"
                        width="280"
                        nav
                        dense
                      >
                        <v-list-item>
                          <v-list-item-avatar color="grey lighten-2">
                            <v-icon color="grey">
                              mdi-account-remove-outline
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <div class="cp-semobold">ไม่มีข้อมูล</div>
                            <div class="cp-overline cp-text-description">
                              ไม่มีรายการทีมงานเหลือแล้ว
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <v-list v-else width="280" nav dense>
                        <v-list-item
                          v-for="(item, index) in projectTeam.checkerList"
                          :key="index + 'checkerList'"
                          @click="onAddTeam(item, 1)"
                        >
                          <v-list-item-avatar color="primary">
                            <img
                              v-if="item.avatar_path"
                              :src="item.avatar_path"
                            />
                            <v-img
                              v-else
                              :src="require('@/assets/images/no-avatar.png')"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <div class="cp-semobold">
                              {{ item.code_name }}
                            </div>
                            <div class="cp-overline cp-text-description">
                              {{ item.first_name + ' ' + item.last_name }}
                            </div>
                            <div class="cp-overline green--text">
                              {{ mapRoleName(item.member_role) }}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-menu>
                  <div
                    :class="
                      fileSelect.typePlan3Preview ? 'cp-team-box-long' : ''
                    "
                    class="cp-team-box"
                  >
                    <div
                      v-for="(list, index) in projectTeam.checkerSelected"
                      :key="index + 'checkerSelected'"
                    >
                      <div class="checker-team">
                        <v-avatar size="32" color="primary">
                          <img
                            v-if="list.avatar_path"
                            :src="list.avatar_path"
                          />
                          <v-img
                            v-else
                            :src="require('@/assets/images/no-avatar.png')"
                          />
                        </v-avatar>
                        <div class="checker-team-content">
                          <div class="cp-caption cp-semibold">
                            {{ list.code_name }}
                          </div>
                          <div class="cp-caption green--text">
                            {{ mapRoleName(list.member_role) }}
                          </div>
                        </div>
                        <div v-if="loading">
                          <v-icon
                            :disabled="loading"
                            class="cp-team-disable-icon"
                          >
                            mdi-trash-can-outline
                          </v-icon>
                        </div>
                        <div v-else class="cp-team-remove">
                          <v-icon
                            class="cp-team-remove-icon"
                            @click="removeTeam(list, 1)"
                          >
                            mdi-trash-can-outline
                          </v-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </cp-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      valid: false,
      loading: false,
      projectDetail: {
        typeValue: '',
        typeItems: [],
        typeRules: [(v) => !!v || 'ข้อมูลจำเป็น'],
        name: '',
        nameRules: [
          (v) => !!v || 'ข้อมูลจำเป็น',
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || 'ห้ามใส่อักษรพิเศษ',
          (v) => !/^\s+/.test(v) || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        description: '',
      },
      typeDetail: {
        address: '',
        addressRules: [
          (v) => !/^\s+/.test(v) || v.length === 0 || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        usableArea: '',
        usableAreaRules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || 'กรอกตัวเลขเท่านั้น',
        ],
      },
      customerDetail: {
        name: '',
        nameRules: [
          (v) => !!v || 'ข้อมูลจำเป็น',
          (v) => /^[A-Za-z0-9ก-๏\s]+$/.test(v) || 'ห้ามใส่อักษรพิเศษ',
          (v) => !/^\s+/.test(v) || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        mobileNumber: '',
        mobileNumberRules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || 'กรอกตัวเลขเท่านั้น',
        ],
        email: '',
        emailRules: [
          (v) =>
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v) ||
            v.length === 0 ||
            'กรุณากรอกอีเมลที่ถูกต้อง',
        ],
      },
      projectCoordinator: {
        name: '',
        nameRules: [
          (v) =>
            /^[A-Za-z0-9ก-๏\s]+$/.test(v) ||
            v.length === 0 ||
            'ห้ามใส่อักษรพิเศษ',
          (v) => !/^\s+/.test(v) || v.length === 0 || 'ห้ามมีช่องว่างด้านหน้า',
        ],
        mobileNumber: '',
        mobileNumberRules: [
          (v) => /^\d+$/.test(v) || v.length === 0 || 'กรอกตัวเลขเท่านั้น',
        ],
        email: '',
        emailRules: [
          (v) =>
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v) ||
            v.length === 0 ||
            'กรุณากรอกอีเมลที่ถูกต้อง',
        ],
      },
      fileOption: '',
      fileSelect: {
        typeImagePreview: null,
        typePlan1Preview: null,
        typePlan2Preview: null,
        typePlan3Preview: null,
        typePlan4Preview: null,
      },
      accountList: null,
      projectTeam: {
        projectOwner: {
          accountId: '',
        },
        checkerSupervisor: null,
        checkerSelected: [],
        checkerList: [],
        checkerMax: false,
      },
    }
  },

  head: {
    title: 'Create Project',
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
    accountId(newValue) {
      this.addProjectOwnerDetail()
    },
  },

  created() {
    this.getProjectType()
    this.addProjectOwnerDetail()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),

    unfocusUsableArea() {
      if (this.typeDetail.usableArea !== '') {
        this.typeDetail.usableArea = parseInt(this.typeDetail.usableArea, 10)
      }
    },

    addProjectOwnerDetail() {
      if (this.accountId) {
        this.projectTeam.projectOwner.accountId = this.accountId
      }
    },

    mapRoleName(level) {
      const role = this.appRoleList.find(
        (role) => role.role_level === Number(level)
      )
      return role ? role.role_name : null
    },

    mapTypeName(typeId) {
      const type = this.projectDetail.typeItems.find(
        (type) => type.type_id === typeId
      )
      return type ? type.type_name : null
    },

    async getProjectType() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/setting/type/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            const itemList = data.data
            itemList.forEach((e) => {
              const obj = {
                type_id: e.type_id,
                type_name: e.type_name,
              }
              this.projectDetail.typeItems.push(obj)
            })
          })
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
          if (this.fileOption === 'typeImage') {
            this.fileSelect.typeImagePreview = reader.result
          } else if (this.fileOption === 'typePlan1') {
            this.fileSelect.typePlan1Preview = reader.result
          } else if (this.fileOption === 'typePlan2') {
            this.fileSelect.typePlan2Preview = reader.result
          } else if (this.fileOption === 'typePlan3') {
            this.fileSelect.typePlan3Preview = reader.result
          } else if (this.fileOption === 'typePlan4') {
            this.fileSelect.typePlan4Preview = reader.result
          }
          this.$refs.imageInput.value = null
        }
        reader.readAsDataURL(file)
      }
    },

    async getMemberByRole() {
      const accessToken = await this.getAccessToken()
      if (
        accessToken &&
        this.projectTeam.checkerList.length === 0 &&
        !this.projectTeam.checkerMax
      ) {
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/member/by-team`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.projectTeam.checkerList = data.data
            this.projectTeam.checkerMax = false
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

    onAddTeam(data, action) {
      if (action === 0) {
        this.projectTeam.checkerSupervisor = data
        const index = this.projectTeam.checkerList.findIndex(
          (e) => e.account_id === data.account_id
        )
        if (index !== -1) {
          this.projectTeam.checkerList.splice(index, 1)
        }
        if (this.projectTeam.checkerList.length === 0) {
          this.projectTeam.checkerMax = true
        }
      } else if (action === 1) {
        this.projectTeam.checkerSelected.unshift(data)
        const index = this.projectTeam.checkerList.findIndex(
          (e) => e.account_id === data.account_id
        )
        if (index !== -1) {
          this.projectTeam.checkerList.splice(index, 1)
        }
        if (this.projectTeam.checkerList.length === 0) {
          this.projectTeam.checkerMax = true
        }
      }
    },

    removeTeam(data, action) {
      if (action === 0) {
        this.projectTeam.checkerSupervisor = null
        this.projectTeam.checkerList.unshift(data)
      } else if (action === 1) {
        this.projectTeam.checkerList.unshift(data)
        const index = this.projectTeam.checkerSelected.findIndex(
          (e) => e.account_id === data.account_id
        )
        if (index !== -1) {
          this.projectTeam.checkerSelected.splice(index, 1)
        }
      }
    },

    validationCreate() {
      if (this.$refs.formCreate.validate()) {
        this.onCreateProject()
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    },

    cleanText(text) {
      const textWithSpaces = text.replace(/\t/g, ' ')
      return textWithSpaces.trim()
    },

    async onCreateProject() {
      this.loading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        const dataSetup = {
          project_detail: {
            project_name: this.cleanText(this.projectDetail.name),
            project_note: this.projectDetail.description
              ? this.cleanText(this.projectDetail.description)
              : null,
          },
          type_detail: {
            project_type: this.projectDetail.typeValue,
            type_address: this.typeDetail.address
              ? this.cleanText(this.typeDetail.address)
              : null,
            type_usable_area: this.typeDetail.usableArea || null,
          },
          file_image: {
            project_image: this.fileSelect.typeImagePreview,
            type_plan1: this.fileSelect.typePlan1Preview,
            type_plan2: this.fileSelect.typePlan2Preview,
            type_plan3: this.fileSelect.typePlan3Preview,
            type_plan4: this.fileSelect.typePlan4Preview,
          },
          customer_detail: {
            customer_name: this.cleanText(this.customerDetail.name),
            customer_phone: this.customerDetail.mobileNumber || null,
            customer_email: this.customerDetail.email || null,
          },
          project_coordinator: {
            coordinator_name: this.projectCoordinator.name
              ? this.cleanText(this.projectCoordinator.name)
              : null,
            coordinator_phone: this.projectCoordinator.mobileNumber || null,
            coordinator_email: this.projectCoordinator.email || null,
          },
          project_teams: {
            project_owner: this.projectTeam.projectOwner.accountId,
            checker_supervisor: this.projectTeam.checkerSupervisor
              ? this.projectTeam.checkerSupervisor.account_id
              : null,
            checker_team:
              this.projectTeam.checkerSelected.length !== 0
                ? this.projectTeam.checkerSelected.map(
                    (checker) => checker.account_id
                  )
                : null,
          },
        }
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/project/create`,
            {
              project_data: dataSetup,
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
              title: 'ดำเนินการสำเร็จ',
              message: 'สร้างโปรเจคสำเร็จ',
            })
            setTimeout(() => {
              this.$router.push('/projects/list')
            }, 1000)
          })
          .catch(({ response }) => {
            this.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'เกิดข้อผิดพลาด',
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
  max-width: 200px;
}
.file-card-upload-main-disable {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 245px;
  border-radius: 4px;
  color: var(--gray-300);
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
  height: 200px;
  border-radius: 4px;
  color: var(--gray-300);
}
.file-card-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dotted var(--gray-100);
  padding: 16px;
  height: 200px;
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
.file-card-show {
  border: 1px solid var(--gray-100);
  padding: 16px;
  border-radius: 4px;
}
.file-card-show .image-zone {
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--gray-100);
}
.cp-menu {
  max-height: 300px;
  overflow: auto;
}
.cp-subheader {
  background-color: var(--base-light);
  padding: 16px 16px 12px 16px;
  cursor: default;
  font-size: var(--font-size-caption);
  color: var(--gray-400);
}
.cp-team {
  width: 100%;
  margin-left: 16px;
  margin-right: 8px;
  overflow: hidden;
}
.cp-team-remove {
  width: fit-content;
  padding: 8px;
  border-radius: 8px;
  transition: all ease 0.3s;
}
.cp-team-disable-icon {
  width: fit-content;
  padding: 8px;
}
.cp-team-remove:hover {
  background-color: var(--red-opacity-2);
}
.cp-team-remove:hover .cp-team-remove-icon {
  color: var(--base-error);
}
.cp-btn-add {
  background-color: var(--gray-opacity-1);
  width: 100%;
  padding: 16px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid var(--gray-500);
  transition: all ease 0.3s;
}
.cp-btn-add:hover {
  background-color: var(--gray-opacity-2);
}
.checker-add-disable {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: var(--gray-opacity-1);
  border: 1px solid var(--gray-200);
  width: 100%;
  height: 55px;
  margin-bottom: 8px;
}
.checker-add {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: var(--gray-opacity-1);
  border: 1px solid var(--gray-500);
  width: 100%;
  height: 55px;
  transition: all ease 0.3s;
}
.checker-add:hover {
  background-color: var(--gray-opacity-2);
}
.checker-team {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  border-top: 1px solid var(--gray-100);
  transition: all ease 0.3s;
}
.checker-team-content {
  width: 100%;
}
.cp-team-box {
  max-height: 180px;
  overflow: auto;
  margin-top: 16px;
}
.cp-team-box-long {
  max-height: 300px;
}
</style>
