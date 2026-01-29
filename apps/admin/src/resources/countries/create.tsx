// ============================================
// CRÉATION D'UN PAYS - VERSION AMÉLIORÉE
// ============================================
// Validation géographique, messages clairs
// Location: apps/admin/src/resources/countries/create.tsx

import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Select, InputNumber, Row, Col, Card, Alert, Divider, Typography } from 'antd';

const { Text } = Typography;

// ============================================
// COMPOSANT
// ============================================

export const CountryCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        
        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            🌍 Informations générales
          </span>
        </Divider>

        {/* Informations générales */}
        <Card 
          type="inner"
          style={{ marginBottom: 16, border: '1px solid #e8dcc8' }}
        >
          <Row gutter={16}>
            <Col span={16}>
              {/* Nom du pays */}
              <Form.Item
                label="Nom du pays *"
                name="name"
                rules={[
                  { required: true, message: '❌ Le nom est requis' },
                  { min: 2, message: '❌ Au moins 2 caractères' },
                ]}
              >
                <Input 
                  placeholder="Ex: Mali"
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              {/* Code ISO */}
              <Form.Item
                label="Code ISO *"
                name="code"
                rules={[
                  { required: true, message: '❌ Le code est requis' },
                  { 
                    len: 2, 
                    message: '❌ Exactement 2 lettres (ex: ML)' 
                  },
                  {
                    pattern: /^[A-Z]{2}$/,
                    message: '❌ Majuscules uniquement (A-Z)',
                  },
                ]}
                tooltip="Code ISO 3166-1 alpha-2"
              >
                <Input 
                  placeholder="ML"
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            📍 Coordonnées géographiques
          </span>
        </Divider>

        {/* Alert info coordonnées */}
        <Alert
          message="Utilisez Google Maps pour trouver les coordonnées du centre du pays"
          description="Format : Latitude (-90 à 90), Longitude (-180 à 180)"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* Coordonnées géographiques */}
        <Card 
          type="inner"
          style={{ marginBottom: 16, border: '1px solid #e8dcc8' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Latitude *"
                name={['coords', 'lat']}
                rules={[
                  { required: true, message: '❌ La latitude est requise' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  placeholder="17.57"
                  min={-90}
                  max={90}
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label="Longitude *"
                name={['coords', 'lng']}
                rules={[
                  { required: true, message: '❌ La longitude est requise' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  placeholder="-4.0"
                  min={-180}
                  max={180}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2a2a2a' }}>
            ⚠️ Contexte de la presse
          </span>
        </Divider>

        {/* Contexte et risque */}
        <Card 
          type="inner"
          style={{ border: '1px solid #e8dcc8' }}
        >
          {/* Niveau de risque */}
          <Form.Item
            label="Niveau de risque *"
            name="riskLevel"
            rules={[{ required: true, message: '❌ Le niveau est requis' }]}
          >
            <Select 
              placeholder="Sélectionner un niveau de risque"
              size="large"
              options={[
                { 
                  value: 'high',
                  label: '🟡 Élevé - Pressions et menaces fréquentes',
                },
                { 
                  value: 'critical',
                  label: '🟠 Critique - Violences régulières, impunité',
                },
                { 
                  value: 'extreme',
                  label: '🔴 Extrême - Zone de conflit, danger mortel',
                },
              ]}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description du contexte *"
            name="description"
            rules={[
              { required: true, message: '❌ La description est requise' },
              { min: 20, message: '❌ Au minimum 20 caractères' },
            ]}
            extra="Décrivez la situation de la liberté de la presse dans ce pays"
          >
            <Input.TextArea
              rows={4}
              placeholder="Ex: Zone de conflit armé depuis 2012. Les journalistes couvrant le nord du pays sont particulièrement exposés aux groupes armés et aux représailles."
              maxLength={1000}
              showCount
              size="large"
            />
          </Form.Item>
        </Card>

      </Form>
    </Create>
  );
};

export default CountryCreate;