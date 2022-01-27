<script>
    export let name
    export let checked
</script>
<label on:click>
    <input type="checkbox" class="hidden peer" autocomplete="off" bind:checked={checked} on:change>
    <div class="basic-button" type="button">
        {name}
    </div>
</label>