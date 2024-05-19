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
                setNewMessage:false,
                disabled:false
            
            }
        },
        watch:{
            'newMessage':{
                immediate:true,
                handler(newValue){
                    this.setNewMessage = newValue
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
            },
            circularMenuDropdown(){
                this.circulardrop = !this.circulardrop
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
            },
            CompletedEmit(){
                this.$emit("CompletedEmit",{data:this.data})
            },
            TaskDetailsEmit(){
                this.$emit("TaskDetailsEmit",{data:this.data, readOnlyMode:true})
            },
            
            DataSaveLeaveProjectEmit(){
                this.$emit("DataSaveLeaveProjectEmit",{data:this.data, str:'leaveProject'})
            },
            setButtonDisabled(){
              this.disabled=true
              setTimeout(()=>{
                this.disabled=false
              },1500);
            }
        },
        mounted(){
           
        }
    }
</script>

<template>
    <button  class="circular ui scrolling dropdown blue icon button" :class="{active: this.circulardrop}" @click="circularMenuDropdown" v-click-away="onClickAway" @dblclick="setButtonDisabled" :disabled="disabled">
        <i class="ellipsis horizontal icon"></i>
        <div ref="dropdown" class="menu"  :class="{ active: this.circulardrop }" >
            <div  class="item" v-for="(button, index) in buttons" :key="index"><button :class="button.class" @click="handleClick(button.onclick)"><i :class="button.icon.primary ? button.icon.primary:button.icon"></i><div v-html="button.label"></div><i :class="button.icon.secoundary ? button.icon.secoundary:none" v-if="setNewMessage==true"></i></button></div>
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