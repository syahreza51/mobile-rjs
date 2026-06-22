import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Checkbox,
  List,
  Menu,
  Button,
  Surface,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import DynamicFieldRenderer from '../../components/DynamicFieldRenderer';
import DocumentationSection from '../../components/DocumentationSection';
import InspectionHeader from '../../components/inspection/InspectionHeader';
import InspectionStepNav from '../../components/inspection/InspectionStepNav';
import InspectionActionBar from '../../components/inspection/InspectionActionBar';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { colors, radius, spacing } from '../../theme';
import { inspectionService } from '../../services/inspection-service';
import { SPEC_MAPPING } from '../../lib/spec';
import {
  buildDefaultValues,
  buildLabelMap,
  buildInspectionTabs,
  validateStep,
  getSubGroupLabel,
} from '../../lib/inspection-utils';
import {
  buildExecutionPayload,
  buildExecutionWatchKey,
} from '../../lib/execution-payload';
import { useAutoSaveDraft } from '../../hooks/useAutoSaveDraft';
import {
  enqueueDraft,
  removeDraftFromQueue,
} from '../../services/offline-sync-service';
import { syncPendingDrafts } from '../../services/sync-service';

const RESULT_OPTIONS = [
  'Memenuhi Syarat K3',
  'Tidak Memenuhi Syarat K3',
  'Memenuhi Syarat K3 dengan Catatan',
];

export default function ExecutionScreen({ route, navigation }) {
  const { objectId } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
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

  const templateSchema = useMemo(
    () => data?.existing_result?.template_schema || data?.template_schema,
    [data],
  );

  const sections = useMemo(
    () => templateSchema?.sections || [],
    [templateSchema],
  );

  const tabs = useMemo(() => buildInspectionTabs(sections), [sections]);
  const labelMap = useMemo(() => buildLabelMap(templateSchema), [templateSchema]);
  const totalSteps = tabs.length;
  const progress = totalSteps > 0 ? (activeStep + 1) / totalSteps : 0;

  const incompleteSteps = useMemo(() => {
    const issues = [];
    for (let i = 0; i < totalSteps; i++) {
      const errs = validateStep({
        activeStep: i,
        sections,
        values,
        objectInfo,
      });
      if (errs.length > 0) issues.push(i);
    }
    return issues;
  }, [totalSteps, sections, values, objectInfo]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected || loading) return;
    syncPendingDrafts().catch(() => {});
  }, [isConnected, loading]);

  const watchKey = useMemo(
    () =>
      buildExecutionWatchKey({
        values,
        objectInfo,
        attachments,
        recommendation,
        result,
      }),
    [values, objectInfo, attachments, recommendation, result],
  );

  const saveDraftPayload = useCallback(
    async (silent = false) => {
      const payload = buildExecutionPayload({
        status: 'draft',
        objectInfo,
        values,
        attachments,
        recommendation,
        result,
      });
      const meta = {
        clientName: data?.client?.name,
        objectName: data?.object_info?.name,
      };

      if (!isConnected) {
        enqueueDraft(objectId, payload, meta);
        if (!silent) {
          Alert.alert(
            'Tersimpan Lokal',
            'Draft disimpan di perangkat. Akan disinkronkan saat online.',
          );
        }
        return 'queued';
      }

      try {
        await inspectionService.saveExecution(objectId, payload);
        removeDraftFromQueue(objectId);
        if (!silent) {
          Alert.alert('Berhasil', 'Draft berhasil disimpan.');
        }
        return 'saved';
      } catch (error) {
        enqueueDraft(objectId, payload, meta);
        if (!silent) {
          Alert.alert(
            'Tersimpan Lokal',
            error.response?.data?.message ||
              'Gagal ke server. Draft disimpan lokal untuk disinkronkan.',
          );
        }
        return 'queued';
      }
    },
    [
      objectId,
      objectInfo,
      values,
      attachments,
      recommendation,
      result,
      isConnected,
      data,
    ],
  );

  const { status: autoSaveStatus, lastSavedAt, markSaved, markQueued } =
    useAutoSaveDraft({
      enabled: !loading && !!data,
      debounceMs: 30000,
      watchKey,
      onSave: async () => {
        const outcome = await saveDraftPayload(true);
        return outcome;
      },
    });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const executionData = await inspectionService.getExecutionData(objectId);
      setData(executionData);

      const schema =
        executionData.existing_result?.template_schema ||
        executionData.template_schema;
      const defaultValues = buildDefaultValues(schema);

      setObjectInfo({
        location: executionData.object_info?.location || '',
        is_recertification:
          executionData.object_info?.is_recertification || false,
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

  const tryAdvanceStep = () => {
    const errors = validateStep({ activeStep, sections, values, objectInfo });
    if (errors.length > 0) {
      Alert.alert('Lengkapi Data', errors.slice(0, 3).join('\n'));
      return;
    }
    setActiveStep(s => Math.min(s + 1, totalSteps - 1));
  };

  const handleSave = async status => {
    if (status === 'completed') {
      if (!isConnected) {
        Alert.alert(
          'Perlu Koneksi',
          'Menyelesaikan inspeksi membutuhkan koneksi internet.',
        );
        return;
      }
      if (!result) {
        Alert.alert('Peringatan', 'Hasil Pemeriksaan Teknis harus diisi.');
        return;
      }
      if (!attachments || attachments.length < 2) {
        Alert.alert('Peringatan', 'Dokumentasi minimal 2 gambar.');
        return;
      }
      const allErrors = [];
      for (let i = 0; i < sections.length + 1; i++) {
        allErrors.push(
          ...validateStep({ activeStep: i, sections, values, objectInfo }),
        );
      }
      if (allErrors.length > 0) {
        Alert.alert('Data Belum Lengkap', allErrors.slice(0, 4).join('\n'));
        return;
      }
    }

    try {
      setSaving(true);

      if (status === 'draft') {
        const outcome = await saveDraftPayload(false);
        if (outcome === 'saved') markSaved();
        if (outcome === 'queued') markQueued();
        return;
      }

      const payload = buildExecutionPayload({
        status: 'completed',
        objectInfo,
        values,
        attachments,
        recommendation,
        result,
      });
      await inspectionService.saveExecution(objectId, payload);
      removeDraftFromQueue(objectId);
      markSaved();
      Alert.alert('Berhasil', 'Laporan K3 berhasil diselesaikan.');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Gagal menyimpan data.',
      );
    } finally {
      setSaving(false);
    }
  };

  const renderDataUmum = () => {
    const subSectorName = data?.object_info?.sub_sector?.name;
    const specFields = SPEC_MAPPING[subSectorName] || [];

    return (
      <Surface style={styles.stepCard} elevation={1}>
        <Text style={styles.stepTitle}>Data Umum</Text>
        <Text style={styles.stepDesc}>
          Informasi lokasi dan spesifikasi teknis objek yang diperiksa.
        </Text>
        <TextInput
          mode="outlined"
          label="Lokasi Objek *"
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
      </Surface>
    );
  };

  const renderTemplateSection = section => (
    <Surface style={styles.stepCard} elevation={1}>
      <Text style={styles.stepTitle}>{section?.title}</Text>
      {section?.groups?.map((group, gIdx) => (
        <List.Accordion
          key={`${group.id || group.group_label}-${gIdx}`}
          title={group.group_label || `Kelompok ${gIdx + 1}`}
          initiallyExpanded={gIdx === 0}
          style={styles.accordion}
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
            <View key={`${sub.id}-${sIdx}`} style={styles.subGroup}>
              <Text style={styles.subGroupTitle}>{getSubGroupLabel(sub)}</Text>
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
    </Surface>
  );

  const renderConclusion = () => (
    <Surface style={styles.stepCard} elevation={1}>
      <Text style={styles.stepTitle}>Pernyataan & Rekomendasi</Text>
      <Menu
        visible={resultMenuVisible}
        onDismiss={() => setResultMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setResultMenuVisible(true)}
            style={styles.input}
            contentStyle={styles.selectContent}
          >
            {result || 'Pilih Hasil Pemeriksaan Teknis *'}
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
    </Surface>
  );

  const renderStepContent = () => {
    if (activeStep === 0) return renderDataUmum();
    if (activeStep <= sections.length) {
      return renderTemplateSection(sections[activeStep - 1]);
    }
    if (activeStep === sections.length + 1) {
      return (
        <Surface style={styles.stepCard} elevation={1}>
          <DocumentationSection
            attachments={attachments}
            onChange={setAttachments}
          />
        </Surface>
      );
    }
    return renderConclusion();
  };

  if (loading) {
    return <LoadingScreen message="Memuat dokumen teknis..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <InspectionHeader
        navigation={navigation}
        clientName={data?.client?.name}
        objectName={data?.object_info?.name}
        location={data?.object_info?.location}
        statusUji={data?.status_uji}
        progress={progress}
        isConnected={isConnected}
        autoSaveStatus={autoSaveStatus}
        lastSavedAt={lastSavedAt}
      />

      {!isTablet ? (
        <InspectionStepNav
          tabs={tabs}
          activeStep={activeStep}
          onStepChange={setActiveStep}
          incompleteSteps={incompleteSteps}
        />
      ) : null}

      <View style={[styles.body, isTablet && styles.bodyTablet]}>
        {isTablet ? (
          <InspectionStepNav
            tabs={tabs}
            activeStep={activeStep}
            onStepChange={setActiveStep}
            incompleteSteps={incompleteSteps}
          />
        ) : null}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepContent()}
        </ScrollView>
      </View>

      <InspectionActionBar
        activeStep={activeStep}
        totalSteps={totalSteps}
        saving={saving}
        onPrev={() => setActiveStep(s => Math.max(s - 1, 0))}
        onNext={tryAdvanceStep}
        onSaveDraft={() => handleSave('draft')}
        onSubmit={() => handleSave('completed')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  bodyTablet: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  input: { marginBottom: spacing.md, backgroundColor: colors.surface },
  selectContent: { justifyContent: 'flex-start' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  accordion: { backgroundColor: colors.surfaceMuted, marginBottom: spacing.sm, borderRadius: radius.md },
  subGroup: {
    paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryLight,
    marginLeft: 4,
  },
  subGroupTitle: {
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontSize: 13,
  },
});
