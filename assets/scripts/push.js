const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const save_subscription = async (subscription) => {
    try {
        const res = await fetch('https://subscribe-6q6qb65uba-uc.a.run.app', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(subscription)
        })
        if (res) return await res.text()
        return null

    } catch {
        console.log('Error Saving Subscription')
    }
} 

const subscribe = async () => {
    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            throw new Error('Service Worker registration not found');
        }

        const public_key = "BPq3FGcZuuoNOSmf_dI3kp6eIdIeTS-r2AEtteP1ImCQrM5ZkybsSs1FUzfijPhCroWjm2v0FEt9omfPhmCJ83k"

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(public_key)
        });

        const response = await save_subscription(subscription);
        // console.log(response)

    } catch (error) {
        console.error('Subscription failed:', error);
    }
}
subscribe()
