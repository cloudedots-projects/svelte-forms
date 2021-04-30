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
  <input type="text" name="email" bind:value={$form.email} use:formControl />
  <input
    type="password"
    name="password"
    bind:value={$form.password}
    use:formControl
  />

  <button type="submit" disabled={!$isValid}>Submit</button>
</form>
