<script>
import VueClickAway from "vue3-click-away";
    export default{
        props:{
            data:Array,
            component:"",
            role:Array,
            buttons:{},
            newMessage:false,
        },
        directives:{
            VueClickAway,
        },
       
        data(){
            return{
                circulardrop:false,
                //dropdownClasses:false,
                componentButtons:[],
                setNewMessage:false
                
            
            }
        },
        watch:{
            'buttons':{
                immediate:true,
                handler(newValue){
                    this.componentButtons = newValue
                    
                    //console.log("Hello from watcher", this.componentButtons)
                }
            },
            'newMessage':{
                immediate:true,
                handler(newValue){
                    this.setNewMessage = newValue
                    //console.log("Hello from watcher_newMessage",newValue)
                }

            }
        },
        methods:{
            handleClick(methodName) {
                if (typeof this[methodName] === 'function') {
                    this[methodName]();
                }
            },
            onClickAway(){
                this.circulardrop = false
                this.componentButtons = []
                //this.setNewMessage=false
            },
            /*async circularMenuDropdown(){
                this.circulardrop = !this.circulardrop
                console.log("circular drop")
                this.dropdownClasses = await this.dropdownDynamicDirection();
                console.log(this.dropdownClasses);
                
            },*/
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
            CommentEmit(){
                this.$emit("CommentEmit",{data: this.data})
            },
            SwitchModal(){
                this.$emit("SwitchModal",{data: this.data})
                console.log("hello from circle modal")
            },
            CompletedEmit(){
                this.$emit("CompletedEmit",{data:this.data})
            },
            TaskDetailsEmit(){
                this.$emit("TaskDetailsEmit",{data:this.data, readOnlyMode:true})
            },
            /*dropdownDynamicDirection(){
                return new Promise((resolve) => {
                    setTimeout(() => {
                    const dropdownMenu = this.$refs.dropdown;
                    const rect = dropdownMenu.getBoundingClientRect();
                    console.log(rect);
                    if (rect.bottom > window.innerHeight && this.circulardrop) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                    }, 1);
                });
                
                
            }*/
            
            DataSaveLeaveProjectEmit(){
                this.$emit("DataSaveLeaveProjectEmit",{data:this.data, str:'leaveProject'})
            },
        },
        mounted(){
           
        }
    }
</script>

<template>
    <button  class="circular ui scrolling dropdown blue icon button" :class="{active: this.circulardrop}" @click="circularMenuDropdown" v-click-away="onClickAway" >
        <i class="ellipsis horizontal icon"></i>
        <div ref="dropdown" class="menu"  :class="{ active: this.circulardrop }" >
            <div  class="item" v-for="button in componentButtons" :key="button.label"><button :class="button.class" @click="handleClick(button.onclick)"><i :class="button.icon.primary ? button.icon.primary:button.icon"></i><div v-html="button.label"></div><i :class="button.icon.secoundary ? button.icon.secoundary:none" v-if="setNewMessage==true"></i></button></div>
            <!--<div  class="item" v-if="component === 'Projects'"><button class="ui small orange button item" @click="redirectEmit()"><i class="tasks icon"></i>View Tasks</button></div>
            <div class="item" v-if="component === 'Projects'"><button class="ui small green button item" @click="showParticipantModalEmit()"><i class="user plus icon"></i>Employees</button></div>
            <div class="item" v-if="component === 'Tasks'"><button class="ui normal green button item " @click="Attach_ModalEmit()"><i class="user plus icon"></i>Attach To<br> Employee</button></div>
            <div class="item" v-if="component === 'Tasks'"><button class="ui normal green button item" @click=" AttachMyselfEmit()"><i class="user plus icon"></i>Attach To<br> Myself</button></div>
            <div class="item"><button class="ui normal violet button item" @click=" EditEmit()"><i class="edit icon"></i>Edit</button></div>
            <div class="item" v-if="component === 'Users'"><button class="ui small red button item" @click="DataSaveEmit()"><i class="close icon"></i>Ban user</button></div>
            <div class="item" v-if="component === 'Users'"><button class="ui small purple button item" @click="DataSaveRolesEmit()"><i class="balance scale icon"></i>Roles</button></div>
            <div class="item" v-if="component === 'Users'"><button class="ui small orange button item" @click="DataSaveResetPasswordEmit()"><i class="key icon"></i>Reset<br> password</button></div>
            <div class="item" v-if="component === 'Projects' || component === 'Tasks'"><button class="ui small blue button item" @click="CommentEmit()"><i class="comments icon"></i>Comments<i class="ui red bell icon"></i></button></div>-->
        </div>
    </button>
</template>


<style scoped>
    .ui.button.dropdown .menu.active{
        display: block !important;
        scrollbar-width: thin;

    }

    .ui.button.item{
        width: 120px !important;
    }
    i.red.icon{
        /*bottom:5px;
        left:5px;*/
        top:5px;
        opacity: 1 !important;
    }

    i.red.icon:hover {
        animation: shake 0.4s;
        animation-iteration-count: 1;
    }

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    20% { transform: translate(-2px, 0px) rotate(1deg); }
    30% { transform: translate(2px, 2px) rotate(0deg); }
    60% { transform: translate(-1px, 1px) rotate(0deg); }
    70% { transform: translate(1px, 1px) rotate(-1deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>