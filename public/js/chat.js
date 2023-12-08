const socket = io()

const $inputForm = document.querySelector('#message-form')
const $inputFormButton = $inputForm.querySelector('button')
const $inputFormMessage = $inputForm.querySelector('input')
const $message = document.querySelector('#message')

const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true })

const autoscroll = () => {
    $message.scrollTop = $message.scrollHeight
}

socket.on('message', (message) => {
    console.log(message.text)
    const html = Mustache.render(messageTemplate, {
        user: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()
 })

$inputForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $inputFormButton.setAttribute('disabled', 'disabled')

    socket.emit('messageSent', e.target.elements.text.value, () => {
        $inputFormButton.removeAttribute('disabled')
        $inputFormMessage.value = ""
        $inputFormMessage.focus()
        console.log('Delivered!')
    })
})

 socket.emit('join', { username, room}, (error) => {
        if(error){
            alert(error)
            location.href = '/'
        }
 })

 socket.on('roomData', ({ room, users }) => {
    console.log(room)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
 })