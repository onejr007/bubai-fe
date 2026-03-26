# Admin Components

Reusable UI components untuk admin panel. Dibuat sebagai template untuk AI Agents.

## 📦 Components

### AdminLayout
Sidebar layout dengan navigation menu.

### Button
Styled button dengan variants (primary, secondary, danger, success).

### Card
Container component dengan header dan body.

### SearchBar
Search input dengan icon dan clear button.

### Badge
Status badge dengan color variants.

### FormField
Form input dengan label, validation, dan error handling.

### Modal
Modal dialog dengan overlay dan animations.

### DataTable
Data table dengan custom columns dan row actions.

## 🚀 Usage

### Import Single Component
```typescript
import { Button } from '@components/admin/Button';
```

### Import Multiple Components
```typescript
import { Button, Card, Badge } from '@components/admin';
```

## 📖 Documentation

Lihat dokumentasi lengkap di: `AI_DOCS/ADMIN_TEMPLATE_GUIDE.md`

## 🎨 Styling

Semua components menggunakan CSS variables dari `global.css`:
- `--primary`, `--success`, `--danger`, `--warning`, `--info`
- `--dark`, `--light`, `--border`, `--text`
- `--radius`, `--shadow`, `--transition`

## ✨ Features

- Modern design
- Fully responsive
- TypeScript support
- Consistent styling
- Easy to customize
- Accessible
- Smooth animations

## 🤖 Untuk AI Agents

Components ini dirancang untuk:
- Copy-paste ready
- Minimal configuration
- Consistent UI/UX
- Easy to extend
- Well documented

## 📝 Example

```typescript
import React, { useState } from 'react';
import { AdminLayout, Button, Card, Modal } from '@components/admin';

const MyPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout>
      <Card title="My Card" icon="📊">
        <Button onClick={() => setShowModal(true)}>
          Open Modal
        </Button>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="My Modal"
      >
        <p>Modal content here</p>
      </Modal>
    </AdminLayout>
  );
};
```

## 🔧 Customization

### Extend Components
```typescript
import { Button } from '@components/admin/Button';

const MyButton: React.FC = (props) => {
  return <Button {...props} className="my-custom-class" />;
};
```

### Custom Styling
```css
.my-custom-class {
  /* Your custom styles */
}
```

## ✅ Best Practices

1. Use AdminLayout untuk semua admin pages
2. Use Button untuk consistency
3. Use Modal untuk forms
4. Use DataTable untuk data display
5. Use Badge untuk status
6. Use Card untuk grouping content

## 🆘 Support

Lihat:
- `AI_DOCS/ADMIN_TEMPLATE_GUIDE.md` - Complete guide
- `AI_DOCS/COMPONENT_GUIDE.md` - Component patterns
- `FE/src/modules/claude-admin/` - Example usage
