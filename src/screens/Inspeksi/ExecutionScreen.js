import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  ProgressBar,
  TextInput,
  Checkbox,
  List,
  Divider,
  Menu,
} from 'react-native-paper';
import DynamicFieldRenderer from '../../components/DynamicFieldRenderer';
import DocumentationSection from '../../components/DocumentationSection';
import { inspectionService } from '../../services/inspection-service';
import { SPEC_MAPPING } from '../../lib/spec';

const RESULT_OPTIONS = [
  'Memenuhi Syarat K3',
  'Tidak Memenuhi Syarat K3',
  'Memenuhi Syarat K3 dengan Catatan',
];

function buildDefaultValues(templateSchema) {
  const defaultValues = {};
  const sections = templateSchema?.sections || [];

  const processField = field => {
    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      defaultValues[field.id] = field.defaultValue;
    }
    if (field.type === 'table' && field.tableConfig?.defaultData) {
      defaultValues[field.id] = field.tableConfig.defaultData;
    }
    if (
      (field.type === 'checkbox' || field.type === 'checklist') &&
      !defaultValues[field.id]
    ) {
      defaultValues[field.id] = [];
    }
  };

  sections.forEach(section => {
    section.groups?.forEach(group => {
      group.fields?.forEach(processField);
      group.sub_groups?.forEach(sub => sub.fields?.forEach(processField));
    });
  });

  return defaultValues;
}

function buildLabelMap(templateSchema) {
  const map = {};
  const sections = templateSchema?.sections || [];
  sections.forEach(sec => {
    sec.groups?.forEach(grp => {
      grp.fields?.forEach(fld => {
        if (fld.label) map[fld.label] = fld.id;
      });
      grp.sub_groups?.forEach(sub => {
        sub.fields?.forEach(fld => {
          if (fld.label) map[fld.label] = fld.id;
        });
      });
    });
  });
  return map;
}

export default function ExecutionScreen({ route, navigation }) {
  const { objectId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [result, setResult] = useState('');
  const [resultMenuVisible, setResultMenuVisible] = useState(false);
  const [objectInfo, setObjectInfo] = useState({
    location: '',
    is_recertification: false,
    technical_spec: {},
  });
  const [recommendation, setRecommendation] = useState({
    kesimpulan: '',
    saran: '',
  });

  const sections = useMemo(() => {
    return (
      data?.existing_result?.template_schema?.sections ||
      data?.template_schema?.sections ||
      []
    );
  }, [data]);

  const labelMap = useMemo(
    () =>
      buildLabelMap(
        data?.existing_result?.template_schema || data?.template_schema,
      ),
    [data],
  );

  const totalSteps = sections.length + 3;
  const progress = totalSteps > 0 ? (activeStep + 1) / totalSteps : 0;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const executionData = await inspectionService.getExecutionData(objectId);
      setData(executionData);

      const templateSchema =
        executionData.existing_result?.template_schema ||
        executionData.template_schema;
      const defaultValues = buildDefaultValues(templateSchema);

      setObjectInfo({
        location: executionData.object_info?.location || '',
        is_recertification: executionData.object_info?.is_recertification || false,
        technical_spec: executionData.object_info?.technical_spec || {},
      });

      if (executionData.existing_result) {
        setValues({
          ...defaultValues,
          ...(executionData.existing_result.content_values || {}),
        });
        setAttachments(executionData.existing_result.attachment_links || []);
        setRecommendation(
          executionData.existing_result.recommendation ||
            executionData.object_info?.sub_sector?.recomendation || {
              kesimpulan: '',
              saran: '',
            },
        );
        setResult(executionData.existing_result.result || '');
      } else {
        setValues(defaultValues);
        setRecommendation(
          executionData.object_info?.sub_sector?.recomendation || {
            kesimpulan: '',
            saran: '',
          },
        );
      }
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Tidak dapat memuat data inspeksi.',
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [objectId, navigation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleValueChange = (fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async status => {
    if (status === 'completed') {
      if (!result) {
        Alert.alert('Peringatan', 'Hasil Pemeriksaan Teknis harus diisi.');
        return;
      }
      if (!attachments || attachments.length < 2) {
        Alert.alert('Peringatan', 'Dokumentasi minimal 2 gambar.');
        return;
      }
    }

    try {
      setSaving(true);
      await inspectionService.saveExecution(objectId, {
        status_uji: status,
        object_info: {
          location: objectInfo.location,
          is_recertification: objectInfo.is_recertification,
          technical_spec: objectInfo.technical_spec,
        },
        content_values: values,
        attachment_links: attachments,
        recommendation,
        result,
      });
      Alert.alert(
        'Berhasil',
        status === 'draft'
          ? 'Draft berhasil disimpan.'
          : 'Laporan K3 berhasil diselesaikan.',
      );
      if (status === 'completed') navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Gagal menyimpan data.',
      );
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      const subSectorName = data?.object_info?.sub_sector?.name;
      const specFields = SPEC_MAPPING[subSectorName] || [];

      return (
        <View>
          <Text style={styles.stepTitle}>Data Umum</Text>
          <TextInput
            mode="outlined"
            label="Lokasi Objek"
            multiline
            value={objectInfo.location}
            onChangeText={v => setObjectInfo(prev => ({ ...prev, location: v }))}
            style={styles.input}
          />
          <View style={styles.checkboxRow}>
            <Checkbox
              status={objectInfo.is_recertification ? 'checked' : 'unchecked'}
              onPress={() =>
                setObjectInfo(prev => ({
                  ...prev,
                  is_recertification: !prev.is_recertification,
                }))
              }
            />
            <Text>Re-Sertifikasi (Periodical Inspection)</Text>
          </View>
          {specFields.map(spec => (
            <TextInput
              key={spec.key}
              mode="outlined"
              label={spec.label}
              value={String(objectInfo.technical_spec?.[spec.key] || '')}
              onChangeText={v =>
                setObjectInfo(prev => ({
                  ...prev,
                  technical_spec: { ...prev.technical_spec, [spec.key]: v },
                }))
              }
              style={styles.input}
            />
          ))}
        </View>
      );
    }

    if (activeStep <= sections.length) {
      const section = sections[activeStep - 1];
      return (
        <View>
          <Text style={styles.stepTitle}>{section?.title}</Text>
          {section?.groups?.map((group, gIdx) => (
            <List.Accordion
              key={`${group.group_label}-${gIdx}`}
              title={group.group_label || `Kelompok ${gIdx + 1}`}
              initiallyExpanded
            >
              {group.fields?.map(field => (
                <DynamicFieldRenderer
                  key={field.id}
                  field={field}
                  values={values}
                  handleValueChange={handleValueChange}
                  labelMap={labelMap}
                />
              ))}
              {group.sub_groups?.map((sub, sIdx) => (
                <View key={`${sub.id || sub.title}-${sIdx}`} style={styles.subGroup}>
                  <Text style={styles.subGroupTitle}>{sub.title || sub.group_label}</Text>
                  {sub.fields?.map(field => (
                    <DynamicFieldRenderer
                      key={field.id}
                      field={field}
                      values={values}
                      handleValueChange={handleValueChange}
                      labelMap={labelMap}
                    />
                  ))}
                </View>
              ))}
            </List.Accordion>
          ))}
        </View>
      );
    }

    if (activeStep === sections.length + 1) {
      return (
        <DocumentationSection attachments={attachments} onChange={setAttachments} />
      );
    }

    return (
      <View>
        <Text style={styles.stepTitle}>Pernyataan & Rekomendasi</Text>
        <Menu
          visible={resultMenuVisible}
          onDismiss={() => setResultMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setResultMenuVisible(true)} style={styles.input}>
              {result || 'Pilih Hasil Pemeriksaan Teknis'}
            </Button>
          }
        >
          {RESULT_OPTIONS.map(opt => (
            <Menu.Item
              key={opt}
              onPress={() => {
                setResult(opt);
                setResultMenuVisible(false);
              }}
              title={opt}
            />
          ))}
        </Menu>
        <TextInput
          mode="outlined"
          label="Kesimpulan Pemeriksaan Teknis"
          multiline
          numberOfLines={6}
          value={recommendation.kesimpulan}
          onChangeText={v =>
            setRecommendation(prev => ({ ...prev, kesimpulan: v }))
          }
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Saran dan Rekomendasi"
          multiline
          numberOfLines={6}
          value={recommendation.saran}
          onChangeText={v => setRecommendation(prev => ({ ...prev, saran: v }))}
          style={styles.input}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0055A4" />
        <Text style={styles.loadingText}>Memuat dokumen teknis...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0055A4" />
      <View style={styles.header}>
        <Button icon="arrow-left" textColor="#fff" onPress={() => navigation.goBack()}>
          Kembali
        </Button>
        <View style={styles.headerInfo}>
          <Text style={styles.clientName}>{data?.client?.name}</Text>
          <Text style={styles.objectName}>
            {data?.object_info?.name} • {data?.object_info?.location}
          </Text>
        </View>
        <ProgressBar progress={progress} color="#4ADE80" style={styles.progressBar} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Button
            mode="outlined"
            disabled={activeStep === 0 || saving}
            onPress={() => setActiveStep(s => s - 1)}
            style={styles.footerBtn}
          >
            Sebelumnya
          </Button>
          {activeStep < totalSteps - 1 ? (
            <Button
              mode="contained"
              onPress={() => setActiveStep(s => s + 1)}
              style={styles.footerBtn}
            >
              Lanjut
            </Button>
          ) : (
            <Button
              mode="contained"
              buttonColor="#009639"
              loading={saving}
              onPress={() => handleSave('completed')}
              style={styles.footerBtn}
            >
              Selesai
            </Button>
          )}
        </View>
        <Button mode="text" loading={saving} onPress={() => handleSave('draft')}>
          Simpan Draft
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748B' },
  header: { backgroundColor: '#0055A4', paddingBottom: 12 },
  headerInfo: { paddingHorizontal: 16, paddingBottom: 8 },
  clientName: { color: '#fff', fontWeight: '800', fontSize: 18 },
  objectName: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  progressBar: { marginHorizontal: 16, height: 6, borderRadius: 3 },
  content: { padding: 16, paddingBottom: 120 },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0055A4',
    marginBottom: 16,
  },
  input: { marginBottom: 12, backgroundColor: '#fff' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  subGroup: { paddingLeft: 8, marginBottom: 8 },
  subGroupTitle: { fontWeight: '700', color: '#475569', marginBottom: 8 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
  },
  footerRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  footerBtn: { flex: 1 },
});
