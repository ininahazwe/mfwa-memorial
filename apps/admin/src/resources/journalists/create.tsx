// ============================================
// CRÉATION D'UN JOURNALISTE - VERSION AMÉLIORÉE
// ============================================
// Validation photos, messages d'erreur, preview
// Location: apps/admin/src/resources/journalists/create.tsx

import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, message, Alert, Divider } from 'antd';
import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useState } from 'react';

// ============================================
// CONFIGURATION UPLOAD
// ============================================

const PHOTO_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// ============================================
// COMPOSANT
// ============================================

export const JournalistCreate = () => {
  const { formProps, saveButtonProps } = useForm();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Récupérer la liste des pays pour le select
  const { selectProps: countrySelectProps } = useSelect({
    resource: 'countries',
    optionLabel: 'name',
    optionValue: 'id',
  });

  // ============================================
  // UPLOAD DE PHOTO
  // ============================================

  const handleUpload = async (file: File): Promise<string | null> => {
    // 1. Vérifier la taille
    if (file.size > PHOTO_MAX_SIZE) {
      message.error('❌ La photo ne doit pas dépasser 2 Mo');
      return null;
    }

    // 2. Vérifier le format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      message.error('❌ Format accepté : JPG ou PNG seulement');
      return null;
    }

    // 3. Uploader
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `journalists/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      message.success('✅ Photo uploadée avec succès');
      setPreviewUrl(url); // Afficher la preview
      return url;
    } catch (error: any) {
      console.error('Upload error:', error);
      message.error(`❌ Erreur lors de l'upload : ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // AVANT UPLOAD - VALIDATION LOCALE
  // ============================================

  const beforeUpload = async (file: File) => {
    const url = await handleUpload(file);
    
    if (url) {
      formProps.form?.setFieldValue('photoUrl', url);
    }
    
    return false; // Empêcher l'upload automatique d'Ant Design
  };

  // ============================================
  // RENDU
  // ============================================

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        
        {/* ====== SECTION 1 : INFORMATIONS DE BASE ====== */}
        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            📋 Informations de base
          </span>
        </Divider>

        {/* Nom complet */}
        <Form.Item
          label="Nom complet *"
          name="name"
          rules={[
            { required: true, message: '❌ Le nom est requis' },
            { min: 2, message: '❌ Au moins 2 caractères' },
          ]}
        >
          <Input 
            placeholder="Ex: Amadou Diallo"
            size="large"
          />
        </Form.Item>

        {/* Pays */}
        <Form.Item
          label="Pays *"
          name="countryId"
          rules={[{ required: true, message: '❌ Le pays est requis' }]}
        >
          <Select
            {...countrySelectProps}
            placeholder="Sélectionner un pays"
            size="large"
            onChange={(value, option: any) => {
              // Stocker aussi le nom du pays (dénormalisation)
              formProps.form?.setFieldValue('countryName', option?.label);
            }}
          />
        </Form.Item>

        {/* Champ caché pour countryName */}
        <Form.Item name="countryName" hidden>
          <Input />
        </Form.Item>

        {/* Rôle */}
        <Form.Item
          label="Rôle / Fonction *"
          name="role"
          rules={[{ required: true, message: '❌ Le rôle est requis' }]}
        >
          <Input 
            placeholder="Ex: Reporter d'investigation"
            size="large"
          />
        </Form.Item>

        {/* Année de disparition */}
        <Form.Item
          label="Année de disparition *"
          name="yearOfDeath"
          rules={[{ required: true, message: '❌ L\'année est requise' }]}
        >
          <InputNumber
            min={1900}
            max={new Date().getFullYear()}
            placeholder="Ex: 2023"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            📸 Photo du portrait
          </span>
        </Divider>

        {/* Alerte info photo */}
        <Alert
          message="Format JPG ou PNG • Max 2 Mo"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* URL photo manuelle */}
        <Form.Item
          label="URL de la photo *"
          name="photoUrl"
          rules={[
            { required: true, message: '❌ La photo est requise' },
            { 
              pattern: /^https?:\/\/.+/, 
              message: '❌ URL valide requise (http(s)://...)' 
            },
          ]}
          extra="Entrez une URL ou uploadez une image ci-dessous"
        >
          <Input 
            placeholder="https://..."
            size="large"
          />
        </Form.Item>

        {/* Upload photo */}
        <Form.Item label="Uploader une photo">
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={beforeUpload}
            accept={ALLOWED_EXTENSIONS.join(',')}
            disabled={uploading}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={uploading}
              size="large"
            >
              {uploading ? 'En cours...' : 'Choisir une photo'}
            </Button>
          </Upload>
        </Form.Item>

        {/* Preview photo */}
        {previewUrl && (
          <div style={{ marginBottom: 16 }}>
            <img 
              src={previewUrl} 
              alt="Preview"
              style={{
                maxWidth: 150,
                height: 180,
                objectFit: 'cover',
                borderRadius: 8,
                border: '2px solid #c4a77d',
              }}
            />
          </div>
        )}

        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            📝 Détails complémentaires
          </span>
        </Divider>

        {/* Biographie */}
        <Form.Item 
          label="Biographie" 
          name="bio"
          extra="Parcours professionnel, médias pour lesquels il/elle a travaillé..."
        >
          <Input.TextArea
            rows={3}
            placeholder="Max 500 caractères"
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* Lieu de disparition */}
        <Form.Item 
          label="Lieu de disparition" 
          name="placeOfDeath"
        >
          <Input 
            placeholder="Ex: Tombouctou, Mali"
            size="large"
          />
        </Form.Item>

        {/* Circonstances */}
        <Form.Item 
          label="Circonstances" 
          name="circumstances"
          extra="Description des circonstances de la disparition"
        >
          <Input.TextArea
            rows={3}
            placeholder="Détails pertinents..."
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            🔓 Publication
          </span>
        </Divider>

        {/* Statut de publication */}
        <Form.Item
          label="Publier sur le site"
          name="isPublished"
          valuePropName="checked"
          initialValue={false}
          extra="Si activé, le journaliste apparaîtra sur le site public"
        >
          <Switch 
            checkedChildren="✓ Publié"
            unCheckedChildren="⊘ Brouillon"
          />
        </Form.Item>

      </Form>
    </Create>
  );
};

export default JournalistCreate;