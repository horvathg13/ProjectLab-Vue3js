<script>

export default{
    props:{
       VforArray:Array,
       VforActiveArray:Array,
       disable:true
    },
    data(){
        return{
            selected:[],
            remove:[],
            isDropdownOpen:false,
            dropdownDisbale:false,
            
        }
    },
    watch:{
        'disable':{
            immediate:true,
            handler(newValue){
                this.dropdownDisbale= newValue
            }
            
        }
    },
    methods:{
        toggleDrop(){
            this.$emit("toggleDrop")
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        select(v) {
            
            const selectedUser = {
                id: v.id,
                name: v.name
            };
            
            let exist = this.selected.some(d => d.id === selectedUser.id)
            if(!exist){
                this.selected.push(selectedUser);
                
                this.$emit("select", {select:this.selected, remove:this.remove})
            }
        },
        removeUser(user){
           let index = this.selected.findIndex(u=> u.id === user.id)
           this.selected.splice(index, 1);
           
        },
        removeActiveUser(user){
            this.remove.push(user);
            let index = this.VforActiveArray.indexOf(user);
            this.VforActiveArray.splice(index, 1);

            this.$emit("detach-user", {remove:this.remove})
        }

    },

}




</script>

<template>

    <div class=" ui fluid dropdown selection multiple" @click="toggleDrop" :class="{ active: selected.name,disabled:dropdownDisbale }">
        
        <i class="dropdown icon"></i>
        <input type="hidden">
            <div class="selected-items">
            <a class="ui label transition activeEmployee" v-if="VforActiveArray" v-for="user in VforActiveArray" :key="user.id">{{ user.name ? user.name: "" }}<i class="delete icon" @click="removeActiveUser(user)"></i></a>
            <a class="ui label transition" v-for="user in selected" :key="user.id">{{ user.name ? user.name: "" }}<i class="delete icon" @click="removeUser(user)"></i></a>
            </div>
            <div class="menu" :class="{ active: isDropdownOpen}" >
                <div class="item" v-for="v in VforArray" :key="v.id" @click="select(v)">
                    {{ v.name }}
                </div>
            </div>
    </div>
</template>

<style scoped>

span{
    color:rgba(0,0,0,.87);
    font-weight: unset;
}
.ui label.transition{
    display: inline-block !important;

}

.ui.label.transition.activeEmployee{
    background-color: rgb(61, 240, 61);
}
.selected-items {
  max-height: 80px; 
  overflow-y: auto;
}

</style>