// ============================================
// CRÉATION D'UN PAYS
// ============================================
// Formulaire avec nom, code, coordonnées, description, risque

import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Select, InputNumber, Row, Col, Card } from 'antd';

export const CountryCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
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
                <Input placeholder="Ex: Mali" />
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
                  placeholder="Ex: ML" 
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
                  placeholder="Ex: 17.57"
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
                  placeholder="Ex: -4.0"
                  min={-180}
                  max={180}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 Astuce : Utilisez Google Maps pour trouver les coordonnées du centre du pays.
          </Text>
        </Card>

        {/* Contexte et risque */}
        <Card title="Contexte presse" size="small">
          {/* Niveau de risque */}
          <Form.Item
            label="Niveau de risque"
            name="riskLevel"
            rules={[{ required: true, message: 'Le niveau est requis' }]}
          >
            <Select placeholder="Sélectionner un niveau">
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
            extra="Décrivez la situation de la liberté de la presse dans ce pays"
          >
            <Input.TextArea
              rows={4}
              placeholder="Ex: Zone de conflit armé depuis 2012. Les journalistes couvrant le nord du pays sont particulièrement exposés aux groupes armés et aux représailles."
            />
          </Form.Item>
        </Card>

      </Form>
    </Create>
  );
};

// Import Text pour l'astuce
import { Typography } from 'antd';
const { Text } = Typography;

export default CountryCreate;
