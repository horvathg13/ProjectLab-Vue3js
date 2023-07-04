<script>
    export default{
        props:{
            data:Array,
            component:"",
            role:Array,
        },
        data(){
            return{
                circulardrop:false
            }
        },
        methods:{
            circularMenuDropdown(){
                this.circulardrop = !this.circulardrop
                console.log("circular drop")
            },
            redirectEmit(){
                this.$emit("redirect", {data: this.data})
            },
            showParticipantModalEmit(){
                this.$emit("showParticipantModal", {data: this.data})
            },
            Attach_ModalEmit(){
                this.$emit("Attach_Modal", {data: this.data})

            },
            AttachMyselfEmit(){
                this.$emit("AttachMyself", {data: this.data})

            },
            EditEmit(){
                this.$emit("edit", {data:this.data, switching:true})
            },
            DataSaveEmit(){
                this.$emit("DataSaveEmit", {data:this.data, str:"BannUser"})
            },
            DataSaveRolesEmit(){
                this.$emit("DataSaveRolesEmit", {data:this.data, str:"open_show_role_selector_modal"})
            },
            DataSaveResetPasswordEmit(){
                this.$emit("DataSaveResetPassword", {data:this.data, str:"PasswordResetManual"})
            },
            ChatEmit(){
                this.$emit("Chatemit",{data: this.data})
            }
        }
    }
</script>

<template>
    <button class="circular ui scrolling dropdown blue icon button" :class="{ active,visible : circulardrop }" @click="circularMenuDropdown">
        <i class="ellipsis horizontal icon"></i>
        <div class=" menu"  :class="{ active: this.circulardrop }">
            <div class="item" v-if="component === 'Projects'"><button class="ui small orange button item" @click="redirectEmit()"><i class="tasks icon"></i>View Tasks</button></div>
            <div class="item" v-if="component === 'Projects'"><button class="ui small green button item" @click="showParticipantModalEmit()"><i class="user plus icon"></i>Employees</button></div>
            <div class="item" v-if="component === 'Tasks'"><button class="ui normal green button item " @click="Attach_ModalEmit()"><i class="user plus icon"></i>Attach To Employee</button></div>
            <div class="item" v-if="component === 'Tasks'"><button class="ui normal green button item" @click=" AttachMyselfEmit()"><i class="user plus icon"></i>Attach To Myself</button></div>
            <div class="item"><button class="ui normal violet button item" @click=" EditEmit()"><i class="edit icon"></i>Edit</button></div>
            <div class="item" v-if="component === 'Users'"><button class="ui small red button item" @click="DataSaveEmit()"><i class="close icon"></i>Ban user</button></div>
            <div class="item" v-if="component === 'Users'"><button class="ui small purple button item" @click="DataSaveRolesEmit()"><i class="balance scale icon"></i>Roles</button></div>
            <div class="item" v-if="component === 'Users'"><button class="ui small orange button item" @click="DataSaveResetPasswordEmit()"><i class="key icon"></i>Reset password</button></div>
            <div class="item" v-if="component === 'Projects' || component === 'Tasks'"><button class="ui small blue button item" @click="ChatEmit()"><i class="comment icon"></i>Chat</button></div>
        </div>
    </button>
</template>


<style scoped>
    .ui.button.dropdown .menu.active{
        display: block !important;

    }
    .ui.button.item{
        width: 120px !important;
    }
</style>