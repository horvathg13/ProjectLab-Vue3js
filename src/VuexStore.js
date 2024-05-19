import { createStore } from "vuex";

export const store = createStore({
    state:{
        username: null,
        userData: {},
        userRole:[],
        userID: null,
        selectedRows:[],
        unreadMessages:{},
        notifications:0,
        managerNotifications:0,
        PROJECT: {
            MANAGERBUTTONS: [
                {
                    label: "Employees",
                    emit: {"event": "showParticipantModal", "data": null},
                    class: "ui small green button item",
                    icon: "ui user plus icon",
                    onclick: "showParticipantModalEmit",
                    permissions: ["admin", "manager"]
                },
                {
                    label: "Comments",
                    emit: {"event": "CommentEmit", "data": null},
                    class: "ui small blue button item",
                    icon: {"primary": "ui comments icon", "secoundary": "ui red bell icon"},
                    onclick: "CommentEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label: "Status",
                    emit: {"event": "showParticipantModal", "data": null, "switching": true},
                    class: "ui normal red button item",
                    icon: "exclamation circle icon",
                    onclick: "SwitchModal",
                    permissions: ["admin", "manager"]
                },
                {
                    label: "Edit",
                    emit: {"event": "showParticipantModal", "data": null, "switching": true},
                    class: "ui normal violet button item",
                    icon: "edit icon",
                    onclick: "EditEmit",
                    permissions: ["admin", "manager"]
                },
                {
                    label: "View Tasks",
                    emit: {"event": "redirect", "data": null},
                    class: "ui small orange button item",
                    icon: "ui tasks icon",
                    onclick: "redirectEmit",
                    permissions: ["admin", "manager", "employee"]
                },
            ],
            EMPLOYEEBUTTONS: [
                {
                    label: "View Tasks",
                    emit: {"event": "redirect", "data": null},
                    class: "ui small orange button item",
                    icon: "ui tasks icon",
                    onclick: "redirectEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label: "Comments",
                    emit: {"event": "CommentEmit", "data": null},
                    class: "ui small blue button item",
                    icon: {"primary": "ui comments icon", "secoundary": "ui red bell icon"},
                    onclick: "CommentEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label:"Leave Project",
                    class:"ui small red button item",
                    icon:"ui sign out icon",
                    onclick:"DataSaveLeaveProjectEmit",
                    permissions: ["employee"]
                }
            ]
        },
        TASKS:{
            MANAGERBUTTONS:[
                {
                    label: "Comments",
                    emit: {"event": "CommentEmit", "data": null},
                    class: "ui small blue button item",
                    icon: {"primary": "ui comments icon", "secoundary": "ui red bell icon"},
                    onclick: "CommentEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label: "Status",
                    emit: {"event": "showParticipantModal", "data": null, "switching": true},
                    class: "ui normal red button item",
                    icon: "exclamation circle icon",
                    onclick: "SwitchModal",
                    permissions: ["admin", "manager"]
                },
                {
                    label: "Attach To<br> Employee",
                    emit: { "event": "Attach_Modal", "data": null },
                    class: "ui normal green button item",
                    icon: "ui user puls icon",
                    onclick: "Attach_ModalEmit",
                    permissions: ["admin", "manager"]
                },
                {
                    label: "Attach To<br> Myself",
                    emit: { "event": "AttachMyself", "data": null },
                    class: "ui normal green button item",
                    icon: "ui user puls icon",
                    onclick: "AttachMyselfEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label:"Completed",
                    class:"ui small green button item",
                    icon:"ui check icon",
                    onclick:"CompletedEmit",
                    permissions: ["employee", "manager"]
                },
                {
                    label: "Edit",
                    emit: {"event": "showParticipantModal", "data": null, "switching": true},
                    class: "ui normal violet button item",
                    icon: "edit icon",
                    onclick: "EditEmit",
                    permissions: ["admin", "manager"]
                },
                {
                    label:"Task Details",
                    class:"ui small orange button item",
                    icon:"ui tasks icon",
                    onclick:"TaskDetailsEmit",
                    permissions: ["admin", "manager", "employee"]
                },
            ],
            EMPLOYEEBUTTONS:[
                {
                    label: "Comments",
                    emit: {"event": "CommentEmit", "data": null},
                    class: "ui small blue button item",
                    icon: {"primary": "ui comments icon", "secoundary": "ui red bell icon"},
                    onclick: "CommentEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label: "Attach To<br> Myself",
                    emit: { "event": "AttachMyself", "data": null },
                    class: "ui normal green button item",
                    icon: "ui user puls icon",
                    onclick: "AttachMyselfEmit",
                    permissions: ["admin", "manager", "employee"]
                },
                {
                    label:"Completed",
                    class:"ui small green button item",
                    icon:"ui check icon",
                    onclick:"CompletedEmit",
                    permissions: ["employee", "manager"]
                },
                {
                    label:"Task Details",
                    class:"ui small orange button item",
                    icon:"ui tasks icon",
                    onclick:"TaskDetailsEmit",
                    permissions: ["admin", "manager", "employee"]
                },
            ]
        }
    },
    mutations:{
        getManagerNotifications(state,data){
            state.managerNotifications = data
        },
        getNotifications(state,data){
            state.notifications = data
        },
        getUnreadMessages(state,data){
            state.unreadMessages = data
        },
        
        setUserData(state, data) {
            state.userData = data
            state.username = data.name
            state.userID = data.id
        },
  
        deleteUserData(state){
            state.userData = {}
            state.username = ""
            state.userID = {}
        },
        deleteNotifications(state){
            state.notifications = []
        },
        deleteUsername(state){
            state.username=""
        },
        deleteManagerNotifications(state){
            state.managerNotifications=[];
        },
        setuserRole(state,userRole){
            state.userRole=userRole
        },
        deleteUserRole(state){
            state.userRole=""
        },
  
        setUserID(state,data){
            state.userID = data.id
        },
  
        setSelectedRows(state,selectedRows){
            state.selectedRows = selectedRows
        },
    },
})