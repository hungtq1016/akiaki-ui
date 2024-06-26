
import { ref } from 'vue'

import { del, get, post, put } from '@/core/services/helpers/request.helper'
import { successNotification } from '@/core/services/helpers/alert.helper'

import type { TActivity, TTreatmentDetail, TTreatmentDetailRequest, TTreatmentPlant, TTreatmentPlantResponse } from '../../models/type'
import type { Ref } from 'vue'
import type { TUser } from '@/modules/admin-user/models/type'
import type { TPagination, TPaginationResponse } from '@/core/models/type'
import { paginationOptions } from '../data/treatment'
import { useDebounceFn } from '@vueuse/core'
import { v4 } from 'uuid'
import { StatusEnum } from '@/core/models/enum'

export const state = ref<TTreatmentPlantResponse>({} as TTreatmentPlantResponse)

export const activities: Ref<TActivity[]> = ref([])
export const fetchedDetail: Ref<TTreatmentDetail[]> = ref([])
export const patients: Ref<TUser[]> = ref([])
export const searchPatient: Ref<string> = ref('')
export const pagination: Ref<TPagination> = ref({} as TPagination)
export const activity = ref('')
export const details = ref<TActivity[]>([])
export const selectedDetails = ref<TTreatmentDetailRequest[]>([])

export const fetch = async (id: string): Promise<void> => {

  get<TTreatmentPlantResponse>('/api/treatmentplants/' + id).then((response) => {
    if (response?.data) {
      state.value = response.data
    }
  })
}

export const activityTitle = (id:string) => {
  return activities.value.find(act => act.id == id)?.title
}

export const addToDetails = () => {
  selectedDetails.value.push({
    activityId: activity.value,
    treatmentId: v4(),
    date: new Date(),
    status: StatusEnum.Pending
  })
  const detail = activities.value.find(e => e.id == activity.value)
  if (detail !== undefined) details.value.push(detail)
  activity.value = ''
}

export const removeFromDetail = (index: number) => {
  if (index >= 0 && index < selectedDetails.value.length) {
    selectedDetails.value.splice(index, 1);
  }
}

export const fetchPatients = async (value?: string) => {
  searchPatient.value = value || ''
  const options = { ...paginationOptions.value, value: searchPatient.value }

  await get<TPaginationResponse<TUser>>(`/api/users/role/customer/search`, options).then((response) => {
    if (response?.data) {
      const { data, ...page } = response.data
      patients.value = data
      pagination.value = page
    }
  })
}

export const fetchActivities = async () => {
  await get<TActivity[]>(`/api/activities`).then((response) => {
    if (response?.data) {
      activities.value = response.data
    }
  })
}

export const fetchDetails = async (id: string) => {
  await get<TTreatmentDetail[]>(`/api/treatmentdetails/treatments/${id}`).then((response) => {
    if (response?.data) {
      fetchedDetail.value = response.data
      details.value = fetchedDetail.value.map(detail => activities.value.find(activity => activity.id === detail.activityId) as TActivity);
      selectedDetails.value = [...fetchedDetail.value]
    }
  })
}

export const debouncedPatient = useDebounceFn(async () => {
  await fetchPatients()
}, 600, { maxWait: 5000 })

export const submit = async () => {


  const data = await put<TTreatmentPlant, TTreatmentPlant>('/api/treatmentplants/'+state.value.id, state.value);
  if (data?.data) {
    successNotification(data.message);
  }

  try {
    // Deleting existing treatment details
    const deletePromises = fetchedDetail.value.map(detail =>
      del(`/api/treatmentdetails/${detail.id}`)
    );
  
    // Adding new treatment details
    const postPromises = selectedDetails.value.map(detail =>
      post('/api/treatmentdetails', detail)
    );
  
    // Execute all promises concurrently
    await Promise.all([...deletePromises, ...postPromises]);
  
    // Clear selected details and details after successful operations
    selectedDetails.value = [];
    details.value = [];
  } catch (error) {
    console.error('Error updating treatment details:', error);
  }  

  selectedDetails.value = [];
  details.value = [];
};