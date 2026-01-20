// ============================================
// ÉDITION D'UN JOURNALISTE
// ============================================
// Formulaire pré-rempli avec les données existantes

import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, Image, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { useState } from 'react';

export const JournalistEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const [uploading, setUploading] = useState(false);

  // Données actuelles du journaliste
  const journalist = queryResult?.data?.data;

  // Récupérer la liste des pays pour le select
  const { selectProps: countrySelectProps } = useSelect({
    resource: 'countries',
    optionLabel: 'name',
    optionValue: 'id',
    defaultValue: journalist?.countryId,
  });

  // Upload de photo vers Firebase Storage
  const handleUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `journalists/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      message.success('Photo uploadée avec succès');
      return url;
    } catch (error) {
      message.error('Erreur lors de l\'upload');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        
        {/* Nom complet */}
        <Form.Item
          label="Nom complet"
          name="name"
          rules={[{ required: true, message: 'Le nom est requis' }]}
        >
          <Input />
        </Form.Item>

        {/* Pays */}
        <Form.Item
          label="Pays"
          name="countryId"
          rules={[{ required: true, message: 'Le pays est requis' }]}
        >
          <Select
            {...countrySelectProps}
            onChange={(value, option: any) => {
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
          label="Rôle / Fonction"
          name="role"
          rules={[{ required: true, message: 'Le rôle est requis' }]}
        >
          <Input />
        </Form.Item>

        {/* Année de disparition */}
        <Form.Item
          label="Année de disparition"
          name="yearOfDeath"
          rules={[{ required: true, message: "L'année est requise" }]}
        >
          <InputNumber
            min={1900}
            max={new Date().getFullYear()}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* Photo actuelle */}
        {journalist?.photoUrl && (
          <Form.Item label="Photo actuelle">
            <Image
              src={journalist.photoUrl}
              alt={journalist.name}
              width={100}
              height={120}
              style={{ 
                objectFit: 'cover', 
                borderRadius: 8,
                border: '2px solid #c4a77d',
              }}
            />
          </Form.Item>
        )}

        {/* URL de la photo */}
        <Form.Item
          label="URL de la photo"
          name="photoUrl"
          rules={[{ required: true, message: 'La photo est requise' }]}
        >
          <Input />
        </Form.Item>

        {/* Upload nouvelle photo */}
        <Form.Item label="Remplacer la photo">
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={async (file) => {
              try {
                const url = await handleUpload(file);
                formProps.form?.setFieldValue('photoUrl', url);
              } catch (error) {
                // Erreur déjà gérée
              }
              return false;
            }}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Choisir une nouvelle photo
            </Button>
          </Upload>
        </Form.Item>

        {/* Biographie */}
        <Form.Item 
          label="Biographie" 
          name="bio"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* Lieu de disparition */}
        <Form.Item 
          label="Lieu de disparition" 
          name="placeOfDeath"
        >
          <Input />
        </Form.Item>

        {/* Circonstances */}
        <Form.Item 
          label="Circonstances" 
          name="circumstances"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* Statut de publication */}
        <Form.Item
          label="Publier sur le site"
          name="isPublished"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Oui" 
            unCheckedChildren="Non"
          />
        </Form.Item>

      </Form>
    </Edit>
  );
};

export default JournalistEdit;
