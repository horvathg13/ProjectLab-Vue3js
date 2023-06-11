<script>

export default{
    props:{
       VforArray:Array,
       
    },
    data(){
        return{
            selected:[],
                
            isDropdownOpen:false,
                
        }
    },
    methods:{
        toggleDrop(){
            this.$emit("toggleDrop")
            this.isDropdownOpen = !this.isDropdownOpen;
            console.log("toggleDrop is working")
        },
        select(v) {
            
            const selectedUser = {
                id: v.id,
                name: v.name
            };
            
            let exist = this.selected.some(d => d.id === selectedUser.id)
            console.log(exist)
            if(!exist){
                this.selected.push(selectedUser);
                this.$emit("select", {select:this.selected})
            }
            
        },
        removeUser(user){
           let index = this.selected.indexOf(u=> u.id === user.id)
           
           this.selected.splice(index, 1);
           
        }

    },

}




</script>

<template>

    <div class=" ui fluid search dropdown selection multiple" @click="toggleDrop" :class="{ active: selected.name }">
        <select class="ui fluid search dropdown" multiple="">
            <option value="">State</option>
        </select>
        <i class="dropdown icon"></i>
        <input class="search" type="hidden"  v-model="selected.id">
            <a class="ui label transition" style="display: inline-block !important;" v-for="user in selected" :key="user.id">{{ user.name ? user.name: "" }}<i class="delete icon" @click="removeUser(user)"></i></a>
            <div class="selected-text">{{ selected.length > 0 ? selected.map(user => user.name).join(', ') : '' }}</div>
            <div class="menu" :class="{ active: isDropdownOpen }" >
                <div class="item" v-for="v in VforArray" :key="v.id" @click="select(v)">
                    {{ v.name }}
                </div>
            </div>
    </div>
</template>

<style>

span{
    color:rgba(0,0,0,.87);
    font-weight: unset;
}

</style>