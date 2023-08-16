<template>
  <h1>Test PWA App</h1>
</template>

<script setup>
import Pusher from 'pusher-js'
import axios from 'axios'

const config = useRuntimeConfig()

const pusher = ref(null)
const channel = ref(null)

onMounted(() => {
  try {
    subscribeToPush()

    let pusher = new Pusher('640aabe88fca3e056c00', {
      cluster: 'ap1',
      forceTLS: true
    })

    pusher?.subscribe('public')
      .bind('chat', (data) => {
        console.log('pusher websocket data', data)
      })

    console.log('mounted', pusher)
  } catch (err) {
    console.log('error', err)
  }
})

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('serviceWorker undetected/not supported')
    return;
  }

  if (!('PushManager' in window)) {
    console.log('PushManager undetected/not supported')
    return;
  }
  console.log('subscribing to push...')

  const registration = await navigator.serviceWorker.ready
  
  // console.log('current permission value', currentPermission)
  const permission = await askPermission()

  
  // console.log('permission value', permission)
  if (permission === 'granted') {
    const subscription = await registration.pushManager.getSubscription()
    console.log('subscription exists?', subscription)
    if (!subscription) {
      createSubscription(registration)
    } else {
      sendNotification(subscription)
    }
  } else {
    console.log('Permission denied')
  }
}

const sendNotification = (payload) => {
  console.log('payload', payload)
  axios.post(`http://localhost/api/save-subscription`, payload)
}

const createSubscription = (registration) => {
  console.log('creating to subscription...')

  const options = {
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(
      'BAXJxYJvrk9ZktlpOb33Tfps-ratF_SasBMG6CDcbw-S94agYBaZXSQNC2RcB0LISBzfYgeClb0ueBcthSpGol4'
    )
  }

  registration.pushManager.subscribe(options)
    .then(newSubscription => {
      sendNotification(newSubscription)
      console.log('subscription created', newSubscription)
    })
}

const askPermission = () => {
  return new Promise((resolve, reject) => {
    const currentPermission = Notification.permission

    if (currentPermission === 'granted') {
      resolve(currentPermission)
    } else if (currentPermission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === 'granted') {
          resolve(permission)
        } else {
          reject('denied')
        }
      });
    }

    reject('denied')
  })
}
</script>