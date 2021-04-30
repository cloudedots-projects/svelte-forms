<script lang="ts">
    export let form: any;
    export let state: any;
    export let formControl;
    export let index: number;
</script>

<input
    type="text"
    placeholder="State"
    bind:value="{$form.users[index].address.state}"
    name="users[{index}].address.state"
    use:formControl
/>
{#if $state.users[index].address.state._errors?.length} 
    {#each $state.users[index].address.state._errors as error}
        <span class="error">{error}</span>
    {/each} 
{/if}

<input
    type="text"
    placeholder="City"
    bind:value="{$form.users[index].address.city}"
    name="users[{index}].address.city"
    use:formControl
/>
{#if $state.users[index].address.city._errors?.length} 
    {#each $state.users[index].address.city._errors as error}
        <span class="error">{error}</span>
    {/each} 
{/if}