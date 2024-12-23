import { FormGroup } from "@angular/forms";


export class FileUtils {
  static selectedFile: File | null = null;
  static previewImage: string | ArrayBuffer | null = null;

  static onFileSelected(event: Event, formName: FormGroup, fielToChange: string, callback: (preview: string | ArrayBuffer | null) => void) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      const file = fileInput.files[0]
      this.selectedFile = fileInput.files[0];
      formName.patchValue({ [fielToChange]: this.selectedFile });

      const render = new FileReader();
      render.onload = () => {
        callback(render.result);
        console.log(this.previewImage);

      }
      render.readAsDataURL(file);
    }
  }


  static loadFileSelected(fieldForm: string, formName: FormGroup, formsFields: Array<string>) {
    const formData = new FormData();
    
    const formFields = formsFields;
    formFields.map((field) => {
      const value = formName.get(field)?.value;
      if (value) {
        formData.append(field, value);
      }
    })


    if (formFields.includes('tags')) {
      // Procesar los tags como array
      const tags = formName.get('tags')?.value;
      if (Array.isArray(tags)) {
        tags.forEach((tag, index) => {
          formData.append(`tags`, tag);
        });
      }
    }

    const fieldFormChange = formName.get(fieldForm)?.value;
    if (fieldFormChange) {
      formData.append(fieldForm, fieldFormChange)
    }
    return formData;
  }


}