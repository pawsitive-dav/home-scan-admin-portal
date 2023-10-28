<template>
  <v-list nav dense>
    <v-list-item
      v-for="(list, index) in dashboard"
      :key="'dashboard-' + index"
      :to="list.path"
      color="primary"
    >
      <v-list-item-icon>
        <v-icon>mdi-view-dashboard-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="ml-n4"> {{ list.title }} </v-list-item-title>
    </v-list-item>

    <div class="text-divider">website management</div>
    <v-list-item
      v-for="(list, index) in website"
      :key="'website-' + index"
      :to="list.path"
      color="primary"
    >
      <v-list-item-icon>
        <v-icon>{{ 'mdi-' + list.menuIcon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="ml-n4"> {{ list.title }} </v-list-item-title>
    </v-list-item>

    <div class="text-divider">customer data</div>

    <v-list-item
      v-for="(list, index) in dataBacklog"
      :key="'dataBacklog' + index"
      :to="list.path"
      color="primary"
    >
      <v-list-item-icon>
        <v-icon class="ml-1">mdi-account-question-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="ml-n4"> {{ list.title }} </v-list-item-title>
    </v-list-item>

    <v-list-group
      :value="false"
      prepend-icon="mdi-clipboard-account-outline"
      color="primary"
    >
      <template #activator>
        <v-list-item-title class="ml-n4">Internal Data</v-list-item-title>
      </template>
      <v-list-item
        v-for="(list, index) in internalData"
        :key="'internalData' + index"
        :to="list.path"
      >
        <v-list-item-icon class="ml-2">
          <v-icon size="12">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="ml-n6">{{ list.title }}</v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list-group
      :value="false"
      prepend-icon="mdi-clipboard-account-outline"
      color="primary"
    >
      <template #activator>
        <v-list-item-title class="ml-n4">External Data</v-list-item-title>
      </template>
      <v-list-item
        v-for="(list, index) in externalData"
        :key="'externalData' + index"
        :to="list.path"
      >
        <v-list-item-icon class="ml-2">
          <v-icon size="12">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="ml-n6">{{ list.title }}</v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list-group :value="false" prepend-icon="mdi-cog-outline" color="primary">
      <template #activator>
        <v-list-item-title class="ml-n4">Setting</v-list-item-title>
      </template>
      <v-list-item
        v-for="(list, index) in customerSettign"
        :key="'customerSettign' + index"
        :to="list.path"
      >
        <v-list-item-icon class="ml-2">
          <v-icon size="12">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="ml-n6">{{ list.title }}</v-list-item-title>
      </v-list-item>
    </v-list-group>

    <div class="text-divider">accounts</div>
    <v-list-group
      :value="true"
      prepend-icon="mdi-account-circle-outline"
      color="primary"
    >
      <template #activator>
        <v-list-item-title class="ml-n4">Members</v-list-item-title>
      </template>
      <v-list-item
        v-for="(list, index) in members"
        :key="'members' + index"
        :to="list.path"
      >
        <v-list-item-icon class="ml-2">
          <v-icon size="12">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="ml-n6">{{ list.title }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  data: () => ({
    dashboard: [
      {
        title: 'Dashboard',
        path: '/',
        show: true,
      },
    ],
    website: [
      {
        title: 'Overview',
        path: '/website/overview',
        menuIcon: 'web',
      },
      {
        title: 'Promotions',
        path: '/website/promotion',
        menuIcon: 'gift-open-outline',
        show: true,
      },
      {
        title: 'Branches',
        path: '/website/branch',
        menuIcon: 'store-marker-outline',
        show: true,
      },
    ],
    dataBacklog: [
      {
        title: 'Backlog Data',
        path: '/customers/backlog/data-list',
        show: true,
      },
    ],
    internalData: [
      {
        title: 'Data List',
        path: '/customers/internal/data-list',
        show: true,
      },
      {
        title: 'Rejected',
        path: '/',
        show: true,
      },
    ],
    externalData: [
      {
        title: 'Data List',
        path: '/customers/external/data-list',
        show: true,
      },
      {
        title: 'Approved',
        path: '/',
        show: true,
      },
      {
        title: 'Rejected',
        path: '/',
        show: true,
      },
    ],
    customerSettign: [
      {
        title: 'Services',
        path: '/customers/setting/services',
        show: true,
      },
      {
        title: 'Branches',
        path: '/customers/setting/branches',
        show: true,
      },
    ],
    members: [
      {
        title: 'Team List',
        path: '/users/team-list',
        show: true,
      },
      {
        title: 'Approval',
        path: '/users/approval',
        show: true,
      },
    ],
  }),
}
</script>

<style scoped>
.text-divider {
  padding: 12px;
  text-transform: uppercase;
  font-size: var(--font-size-overline);
  color: #a2a3a4;
  letter-spacing: 1px;
}
</style>
