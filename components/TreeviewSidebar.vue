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

    <div class="text-divider">test</div>

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
