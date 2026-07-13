import CategoryImageUpload from './CategoryImageUpload';

export type CategoryFormData = { id?: number; name?: string; slug?: string; image?: string | null };

/** Field markup only — see ProductFormFields for why this is split from the <form> tag. */
export function CategoryFormFields({ category, error }: { category: CategoryFormData; error?: string }) {
  return (
    <>
      {category.id && <input type="hidden" name="id" value={category.id} />}
      {error === 'missing' && <div className="adm-error">Category name can’t be empty.</div>}
      <div className="adm-field">
        <label>Name</label>
        <input name="name" placeholder="e.g. Anklets" defaultValue={category.name || ''} required autoFocus />
      </div>
      <CategoryImageUpload initial={category.image} slug={category.slug} />
    </>
  );
}
