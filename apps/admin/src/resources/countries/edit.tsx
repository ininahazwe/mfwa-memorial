// ============================================
// ÉDITION D'UN PAYS
// ============================================
// Formulaire pré-rempli avec les données existantes

import { Edit, useForm } from '@refinedev/antd';
import { Form, Input, Select, InputNumber, Row, Col, Card, Typography } from 'antd';

const { Text } = Typography;

export const CountryEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();
  
  // Données actuelles du pays
  const country = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        
        {/* Informations générales */}
        <Card title="Informations générales" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              {/* Nom du pays */}
              <Form.Item
                label="Nom du pays"
                name="name"
                rules={[{ required: true, message: 'Le nom est requis' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              {/* Code ISO */}
              <Form.Item
                label="Code ISO (2 lettres)"
                name="code"
                rules={[
                  { required: true, message: 'Le code est requis' },
                  { len: 2, message: 'Exactement 2 lettres' },
                ]}
              >
                <Input 
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Coordonnées géographiques */}
        <Card title="Coordonnées (centre du pays)" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Latitude"
                name={['coords', 'lat']}
                rules={[{ required: true, message: 'La latitude est requise' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={-90}
                  max={90}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label="Longitude"
                name={['coords', 'lng']}
                rules={[{ required: true, message: 'La longitude est requise' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={-180}
                  max={180}
                />
              </Form.Item>
            </Col>
          </Row>
          
          {/* Aperçu des coordonnées actuelles */}
          {country?.coords && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              📍 Position actuelle : {country.coords.lat.toFixed(4)}, {country.coords.lng.toFixed(4)}
            </Text>
          )}
        </Card>

        {/* Contexte et risque */}
        <Card title="Contexte presse" size="small">
          {/* Niveau de risque */}
          <Form.Item
            label="Niveau de risque"
            name="riskLevel"
            rules={[{ required: true, message: 'Le niveau est requis' }]}
          >
            <Select>
              <Select.Option value="high">
                🟡 Élevé - Pressions et menaces fréquentes
              </Select.Option>
              <Select.Option value="critical">
                🟠 Critique - Violences régulières, impunité
              </Select.Option>
              <Select.Option value="extreme">
                🔴 Extrême - Zone de conflit, danger mortel
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description du contexte"
            name="description"
            rules={[{ required: true, message: 'La description est requise' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Card>

      </Form>
    </Edit>
  );
};

export default CountryEdit;
