# Welcome to @cloudedots/svelte-forms 👋

[![NPM Version](https://img.shields.io/npm/v/@cloudedots/svelte-forms.svg?orange=blue)](https://npmjs.org/package/@cloudedots/svelte-forms)

> Svelte Forms Library

### 🏠 [Homepage](https://github.com/cloudedots-projects/svelte-forms#readme)

## Install

```sh
npm install @cloudedots/svelte-forms yup
```

> This package uses **[Yup](https://github.com/jquense/yup)** for validation.

## Basic Usage Example

_[demo/Basic.svelte](https://github.com/cloudedots-projects/svelte-forms/blob/master/demo/Basic.svelte)_ :

```html
<script>
    import { createForm } from "@cloudedots/svelte-forms";
    import * as yup from "yup";

    // Create Form Instance
    const { form, formControl, isValid } = createForm({
        // Initial Form Data
        initialValues: {
            email: '',
            password: '',
        },
        // Form Validation using Yup
        validationSchema: yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().min(6).required()
        })
    });

    const onSubmit = () => {
        // "$form" contains current Form Data
        console.log($form);
    }
</script>

<form on:submit|preventDefault={onSubmit}>
    <input 
        type="text" 
        name="email" 
        bind:value={$form.email}
        use:formControl 
    />
    <input
        type="password"
        name="password"
        bind:value={$form.password}
        use:formControl
    />
    
    <button type="submit" disabled={!$isValid}>Submit</button>
</form>
```

## Full Usage Example

_[demo/Full.svelte](https://github.com/cloudedots-projects/svelte-forms/blob/master/demo/Full.svelte)_ :

```html
<script lang="ts">
  import { createForm } from "@cloudedots/svelte-forms";
  import * as yup from "yup";
  import UserAddressForm from "./UserAddressForm.svelte"; // Components

  // (Optional) Form's Data type will be automatically inferred from "initialValues" in "createForm" if type of Data is not specified
  type FormData = {
    title: string,
    description: string,
    coverImage: FileList,
    users: {
      name: string,
      email: string,
      address: {
        state: string,
        city: string,
      },
    }[],
  };

  // Create Form Instance
  const {
    form, // Svelte Store<FormData> containing Form Data
    state, // Svelte Store<FormState> containing Form State - { [every_property]: { _touched: boolean, _errors: string[] }}
    isValid, // Svelte Store<boolean> containing entire Form's validation status
    isTouched, // Svelte Store<boolean> containing entire Form's touched status
    validateForm, // Function(highlight: 'none' | 'errors' | 'all' = 'none') for manually validting entire form
    handleChange, // Function(event: Event) to manually updating individual form control's state - can be used in place of "formControl" Action
    setTouched, // Function() for manually setting Form state as "touched"
    updateForm, // Function() for updating Form's Structure after Form Controls are Added or Removed in cases like Form Arrays
    formControl, // Svelte Action to be used with <input>, <select>, <textarea> or similar HTML input elements
    resetForm, // Reset the Form with optional new value and clear validation
  } = createForm<FormData>({
    // Initial Values of Form
    initialValues: {
      title: "", // Simple String
      description: "", // Simple String
      coverImage: "", // File Input
      users: [], // Complex Form Array
    },
    // Yup Validation Schema
    validationSchema: yup.object().shape({
      title: yup.string().min(8).required(),
      description: yup.string(),
      coverImage: yup.mixed().test(value => value?.length > 0), // Custom validation because yup does not suport file objects
      users: yup.array().of({
        name: yup.string().required(),
        email: yup.string().email().required(),
        address: yup.object().shape({
          state: yup.string().required(),
          city: yup.string(),
        }),
      }),
    }),
    // CSS class validations
    css: {
      enabled: true, // use CSS classes or not
      validClass: "is-valid", // CSS class added to valid form controls
      invalidClass: "is-invalid", // CSS class added to invalid form controls
      useValid: true, // Add CSS classes to valid form controls
      useInvalid: true, // Add CSS classes to invalid form controls
    },
    validateOnChange: true, // Whether to validate on "change" event of element and form value change
    validateOnBlur: true, // Whether to validate on "blur" event of element
  });

  // Add new user to Users Form Array
  const addUser = () => {
    // Update Form Data
    $form.users = [
      ...$form.users,
      {
        name: "",
        email: "",
        address: {
          state: "",
          city: "",
        },
      },
    ];
    updateForm(); // Manually trigger Form Update - Required
  };

  // Remove user from Users Form Array
  const removeUser = (index) => () => {
    $form.users = $form.users.filter((_, i) => i !== index); // Update Form Data
    $state.users = $state.users.filter((_, i) => i !== index); // Updating State is required after removing Form Controls
    updateForm(); // Manually trigger Form Update - Required
  };

  // Submit Form
  const onSubmit = () => {
    console.log($form); // Get Form Data
    // Reset form after submit
    resetForm({
      title: "",
      description: "",
      coverImage: "",
      users: [],
    });
  };

  $: console.log($form, $state); // Log Form Data and Form State on every Change
</script>

<form on:submit|preventDefault={onSubmit}>

    <input
        placeholder="Title"
        name="title"
        bind:value={$form.title}
        use:formControl
    />
    {#if $state.title._errors?.length}
        {#each $state.title._errors as error}
            <span class="error">{error}</span>
        {/each}
    {/if}

    <input
        placeholder="Description"
        name="description"
        bind:value={$form.description}
        use:formControl
    />
    {#if $state.description._errors?.length}
        {#each $state.description._errors as error}
            <span class="error">{error}</span>
        {/each}
    {/if}

    <input
        name="coverImage"
        accept="image/*"
        bind:files={$form.coverImage}
        use:formControl
    />
    {#if $state.coverImage._errors?.length}
        {#each $state.coverImage._errors as error}
        <span class="error">{error}</span>
        {/each}
    {/if}

    {#if $form.coverImage?.length}
        <div class="image-preview">
            <img
            src={URL.createObjectURL($form.coverImage[0])}
            alt="Cover"
            height="150" />
        </div>
    {/if}

    {#each $form.users as user, index}
        <h2>
            User {user.name}
            <button type="button" on:click={removeUser(i)}>
                Remove User
            </button>
        </h2>

        <input
            placeholder="name"
            name="users[{index}].name"
            bind:value={user.name}
            use:formControl
        />
        {#if $state.users[index].name._errors?.length}
            {#each $state.users[index].name._errors as error}
                <span class="error">{error}</span>
            {/each}
        {/if}

        <input
            placeholder="email"
            name="users[{index}].email"
            bind:value={user.email}
            use:formControl
        />
        {#if $state.users[index].email._errors?.length}
            {#each $state.users[index].email._errors as error}
                <span class="error">{error}</span>
            {/each}
        {/if}

        <!-- Using with Components -->
        <UserAddressForm {form} {state} {formControl} {index} />

    {/each}

    <button type="button" on:click={addUser}>
        Add User
    </button>

    <button type="button" on:click={() => validateForm('errors')}>
        Validate Form
    </button>
    
    <button type="submit" disabled={!$isValid}>
        Submit
    </button>

</form>

<style>
    .valid {
        border: 1px solid green;
    }

    .invalid {
        border: 1px solid red;
    }

    .error {
        color: red;
    }
</style>
```

_[demo/UserAddressForm.svelte](https://github.com/cloudedots-projects/svelte-forms/blob/master/demo/UserAddressForm.svelte)_ :

```html
<script lang="ts">
    export let form: any;
    export let state: any;
    export let formControl;
    export let index: number;
</script>

<input
    type="text"
    placeholder="State"
    bind:value={$form.users[index].address.state}
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
    bind:value={$form.users[index].address.city}
    name="users[{index}].address.city"
    use:formControl
/>
{#if $state.users[index].address.city._errors?.length} 
    {#each $state.users[index].address.city._errors as error}
        <span class="error">{error}</span>
    {/each} 
{/if}
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/cloudedots-projects/svelte-forms/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Cloudedots <contact@cloudedots.com>](https://github.com/cloudedots-projects).

This project is [MIT](https://github.com/cloudedots-projects/svelte-forms/blob/master/LICENSE.md) licensed.
