<script>
export default{
    props:{
       
    },
    data(){
        return{

            isDropdownOpen:false,
            isDropdownOpenMessage:false,
            isDropdownOpenSettings:false,
            isDropdownOpenActions:false,

        }
    },
    methods:{
        toggleDrop(){
           
            this.isDropdownOpen = !this.isDropdownOpen;
            console.log("toggleDrop is working")
        },
        toggleDropMessage(){
            this.isDropdownOpenMessage = !this.isDropdownOpenMessage;
        },
        toggleDropSettings(){
            this.isDropdownOpenSettings = !this.isDropdownOpenSettings;
        },
        toggleDropActions(){
            this.isDropdownOpenActions = !this.isDropdownOpenActions;
        }
    },

}
</script>

<template>
    <div class="main">
       
        <div class="ui styled fluid accordion">
            <div class="title" @click="toggleDrop" :class="{ active: isDropdownOpen }">
                <i class="dropdown icon"></i>
                <i class="user circle icon"></i>
                Profile
                
            </div>
            <div class="content" :class="{ active: isDropdownOpen }">
                <a class="item">Almenüpont 1.1</a>
                <a class="item">Almenüpont 1.2</a>
                <a class="item">Almenüpont 1.3</a>      
            </div>
            <div class="title" @click="toggleDropMessage" :class="{ active: isDropdownOpenMessage }">
                <i class="dropdown icon"></i>
                <i class="envelope icon"></i>
                Messages
                <div class="ui red left pointing label">1</div>
            </div>
            <div class="content" :class="{ active: isDropdownOpenMessage }">
                <a class="item">New</a>
                <a class="item">Sent</a> 
            </div>
            <div class="title" @click="toggleDropSettings" :class="{ active: isDropdownOpenSettings }">
                <i class="dropdown icon"></i>
                <i class="cog icon"></i>
                Settings
            </div>
            <div class="content" :class="{ active: isDropdownOpenSettings }">
                <a class="item">Password</a>
                <a class="item">Notifications</a>
            </div>
            <div class="title" @click="toggleDropActions" :class="{ active: isDropdownOpenActions }">
                <i class="dropdown icon"></i>
                <i class="list icon"></i>
                Actions
            </div>
            <div class="content" :class="{ active: isDropdownOpenActions }">
                <a class="item">Almenüpont 1.1</a>
                <a class="item">Almenüpont 1.2</a>
                <a class="item">Almenüpont 1.3</a>      
            </div>
        </div>
    </div>

</template>

<style scoped>
.main{
    background-color: rgb(14 29 54 / 27%);
    min-width: calc(1000px - 770px);
    min-height: calc(100vh - 55px);
    margin-right:0;
}
.title {
    transition: max-height 0.4s ease !important;
    overflow: hidden;
   
  }

.title.active{
    color:rgba(0,0,0,.95);
    background: 0 0 ;
    max-height: 1000px;
}
.content {
  transition: max-height 0.5s ease;
  overflow: hidden;
  max-height: 0;
}

.content.active {
  max-height: 1000px;
  
  
}
.content a{
    cursor:pointer;
    text-decoration: none;
    color: black;
    display: block;
    padding: 5px
}

.ui.fluid.accordion{
    width:auto;
   
}


</style>